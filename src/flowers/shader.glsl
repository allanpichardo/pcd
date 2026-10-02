precision highp float;

uniform float p;
uniform float z[16];

// Texture uniforms for weights
uniform sampler2D first_layer_weight;
uniform sampler2D first_layer_bias;
uniform sampler2D hidden_tanh_weights;
uniform sampler2D hidden_tanh_biases;
uniform sampler2D hidden_sin_weights;
uniform sampler2D hidden_sin_biases;
uniform sampler2D residual_alphas;
uniform sampler2D film_weights;
uniform sampler2D film_biases;
uniform sampler2D output_weight;
uniform sampler2D output_bias;
uniform sampler2D color_jitter_weight;
uniform sampler2D color_jitter_bias;

varying vec2 vUv;

// Texture lookup helper function
float getWeight(sampler2D tex, int index, int width, int height) {
    int pixelIndex = index / 4;
    int component = index % 4;
    int y = pixelIndex / width;
    int x = pixelIndex % width;
    vec2 uv = (vec2(float(x), float(y)) + 0.5) / vec2(float(width), float(height));
    vec4 pixel = texture2D(tex, uv);
    if (component == 0) return pixel.r;
    else if (component == 1) return pixel.g;
    else if (component == 2) return pixel.b;
    else return pixel.a;
}

vec3 hsv_to_rgb(vec3 hsv) {
    float h = hsv.x, s = hsv.y, v = hsv.z;
    float c = v * s;
    float h_prime = h * 6.0;
    float x = c * (1.0 - abs(mod(h_prime, 2.0) - 1.0));
    float m = v - c;
    int i = int(floor(h_prime)) % 6;
    vec3 rgb;
    if (i == 0) rgb = vec3(c, x, 0.0);
    else if (i == 1) rgb = vec3(x, c, 0.0);
    else if (i == 2) rgb = vec3(0.0, c, x);
    else if (i == 3) rgb = vec3(0.0, x, c);
    else if (i == 4) rgb = vec3(x, 0.0, c);
    else rgb = vec3(c, 0.0, x);
    return rgb + m;
}

float sigmoid(float x) { return 1.0 / (1.0 + exp(-x)); }
float softplus(float x) { return log(1.0 + exp(x)); }

vec3 cppn(vec2 uv, float p, float z[16]) {
    float coords[18];
    float x = uv.x, y = uv.y;
    float r = length(uv);
    float theta = atan(y, x);
    float r1 = r / sqrt(2.0);
    float r2 = r1 * r1;
    float rG = exp(-4.000000 * r1 * r1);
    float pi = 3.141592653589793;
    float fx_sin0 = sin(pi * x);
    float fx_cos0 = cos(pi * x);
    float fx_sin1 = sin(2.0 * pi * x);
    float fx_cos1 = cos(2.0 * pi * x);
    float fy_sin0 = sin(pi * y);
    float fy_cos0 = cos(pi * y);
    float fy_sin1 = sin(2.0 * pi * y);
    float fy_cos1 = cos(2.0 * pi * y);
    float sigma = softplus(1.980059) + 0.0001;
    float phase_offset = 0.194043;
    coords[0] = x;
    coords[1] = y;
    coords[2] = r;
    coords[3] = r1;
    coords[4] = r2;
    coords[5] = rG;
    coords[6] = fx_sin0;
    coords[7] = fx_cos0;
    coords[8] = fx_sin1;
    coords[9] = fx_cos1;
    coords[10] = fy_sin0;
    coords[11] = fy_cos0;
    coords[12] = fy_sin1;
    coords[13] = fy_cos1;
    for(int k=1; k<=2; k++){
        float a_k = exp( - (float(k) - p)*(float(k) - p) / (2.0 * sigma * sigma) );
        float sin_kt = sin(float(k) * (theta + phase_offset));
        float cos_kt = cos(float(k) * (theta + phase_offset));
        coords[14 + 2*(k-1)] = a_k * sin_kt;
        coords[15 + 2*(k-1)] = a_k * cos_kt;
    }
    float out_[16];
    // first layer
    for(int i=0; i<16; i++){
        float sum = getWeight(first_layer_bias, i, 2, 2);
        for(int j=0; j<18; j++){
            sum += getWeight(first_layer_weight, i*18 + j, 9, 8) * coords[j];
        }
        out_[i] = tanh(sum);
    }
    float residual[16];
    for(int i=0; i<16; i++) residual[i] = out_[i];
    // blocks
    for(int block=0; block<3; block++){
        float out_tanh[16];
        for(int i=0; i<16; i++){
            float sum = getWeight(hidden_tanh_biases, block*16 + i, 4, 3);
            for(int j=0; j<16; j++){
                sum += getWeight(hidden_tanh_weights, block*16*16 + i*16 + j, 14, 14) * out_[j];
            }
            out_tanh[i] = tanh(sum);
        }
        float out_sin[16];
        for(int i=0; i<16; i++){
            float sum = getWeight(hidden_sin_biases, block*16 + i, 4, 3);
            for(int j=0; j<16; j++){
                sum += getWeight(hidden_sin_weights, block*16*16 + i*16 + j, 14, 14) * out_[j];
            }
            out_sin[i] = sin(sum);
        }
        for(int i=0; i<16; i++) out_[i] = out_tanh[i] + out_sin[i];
        // z_norm
        float z_mean = 0.0;
        for(int i=0; i<16; i++) z_mean += z[i];
        z_mean /= 16.0;
        float z_var = 0.0;
        for(int i=0; i<16; i++) z_var += (z[i] - z_mean) * (z[i] - z_mean);
        z_var /= 16.0;
        float z_std = sqrt(z_var + 1e-5);
        float z_norm[16];
        for(int i=0; i<16; i++) z_norm[i] = (z[i] - z_mean) / z_std;
        // film
        float film_params[16*2];
        for(int i=0; i<16*2; i++){
            float sum = getWeight(film_biases, block*(16*2) + i, 5, 5);
            for(int j=0; j<16; j++){
                sum += getWeight(film_weights, block*16*(16*2) + i*16 + j, 20, 20) * z_norm[j];
            }
            film_params[i] = sum;
        }
        float gamma[16], beta_[16];
        for(int i=0; i<16; i++){ gamma[i] = film_params[i]; beta_[i] = film_params[16 + i]; }
        float gamma_scale = 1.034044;
        float beta_scale = 0.374099;
        for(int i=0; i<16; i++){
            out_[i] = (1.0 + gamma_scale * gamma[i]) * out_[i] + beta_scale * beta_[i];
        }
        // residual
        float alpha = 0.5 * sigmoid(getWeight(residual_alphas, block, 1, 1));
        for(int i=0; i<16; i++){
            out_[i] = out_[i] + alpha * residual[i];
            residual[i] = out_[i];
        }
    }
    // output
    float output_[3];
    for(int i=0; i<3; i++){
        float sum = getWeight(output_bias, i, 1, 1);
        for(int j=0; j<16; j++){
            sum += getWeight(output_weight, i*16 + j, 4, 3) * out_[j];
        }
        output_[i] = tanh(sum);
    }
    for(int i=0; i<3; i++) output_[i] = (output_[i] + 1.0) / 2.0;
    float h_offset = output_[0], s_raw = output_[1], v_raw = output_[2];
    float h = mod(theta / (2.0 * pi) + h_offset, 1.0);
    float s = s_raw;
    float v = v_raw;
    // jitter
    float jitter[3];
    for(int i=0; i<3; i++){
        float sum = getWeight(color_jitter_bias, i, 1, 1);
        for(int j=0; j<16; j++){
            sum += getWeight(color_jitter_weight, i*16 + j, 4, 3) * z[j];
        }
        jitter[i] = sum;
    }
    float dh = jitter[0], ds = jitter[1], dv = jitter[2];
    h = mod(h + 0.1 * dh, 1.0);
    s = clamp(s + 0.1 * ds, 0.0, 1.0);
    v = clamp(v + 0.1 * dv, 0.0, 1.0);
    vec3 hsv = vec3(h, s, v);
    return hsv_to_rgb(hsv);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    vec3 color = cppn(uv, p, z);
    gl_FragColor = vec4(color, 1.0);
}
