

export class PerlinNoiseGenerator {


    public noise: number[][];

    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.noise = this.generateNoise();
    }

    private generateNoise(): number[][] {
        let noise: number[][] = [];
        for (let x = 0; x < this.width; x++) {
            noise.push([]);
            for (let y = 0; y < this.height; y++) {
                let a = (Math.random() * 10) % 1;
                noise[x].push(a)
            }
        }
        return noise;
    }

    private generateSmoothNoise(baseNoise: number[][], octave: number): number[][] {
        let smoothNoise: number[][] = [];
        let samplePeriod = 1 << octave;
         let sampleFrequency = 1 / samplePeriod;

        for (let i = 0; i < this.width; i++)
        {
            smoothNoise.push(new Array<number>(this.height));

            //calculate the horizontal sampling indices
            let sample_i0 = (i / samplePeriod) * samplePeriod;
            let sample_i1 = (sample_i0 + samplePeriod) % this.width; //wrap around
            let horizontal_blend = (i - sample_i0) * sampleFrequency;

            for (let j = 0; j < this.height; j++)
            {
                //calculate the vertical sampling indices
                let sample_j0 = Math.floor(j / samplePeriod) * samplePeriod;
                let sample_j1 = (sample_j0 + samplePeriod) % this.height; //wrap around
                let vertical_blend = (j - sample_j0) * sampleFrequency;

                //blend the top two corners
                let top = this.lerp(baseNoise[sample_i0][sample_j0], baseNoise[sample_i1][sample_j0], horizontal_blend);

                //blend the bottom two corners
                let bottom = this.lerp(baseNoise[sample_i0][sample_j1], baseNoise[sample_i1][sample_j1], horizontal_blend);

                //final blend
                smoothNoise[i][j] = this.lerp(top, bottom, vertical_blend);
            }
        }
        return smoothNoise;
    }

    public generatePerlinNoise(octaveCount: number): number[][] {

        let smoothNoise: number[][][] = [];
        let persistence = 0.5;

        //generate smooth noise
        for (let i = 0; i < octaveCount; i++)
        {
            smoothNoise[i] = this.generateSmoothNoise(this.noise, i);
        }

        let perlinNoise: number[][] = [];
        for(let i=0; i<this.width; i++) {
            let row:number[] = Array.from({length: this.height}, (v, k) => 0);
            perlinNoise.push(row);
        }

        let amplitude = 1.0;
        let totalAmplitude = 0.0;

        //blend noise together
        for (let octave = octaveCount - 1; octave >= 0; octave--)
        {
            amplitude *= persistence;
            totalAmplitude += amplitude;

            for (let i = 0; i < this.width; i++)
            {
                for (let j = 0; j < this.height; j++)
                {
                    perlinNoise[i][j] += smoothNoise[octave][i][j] * amplitude;
                }
            }
        }

        // normalisation
        for (let i = 0; i< this.width; i++)
        {
            for (let j = 0; j < this.height; j++)
            {
                perlinNoise[i][j] /= totalAmplitude;
            }
        }

        return perlinNoise;
    }


    // Function to linearly interpolate between a and b
    // Weight should be in the range [0.0, 1.0]
    private lerp(a: number, b: number, weight: number) {
            return (1 - weight) * a + weight * b;
    }

}