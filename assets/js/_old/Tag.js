class Tag {
    constructor(data) {
        this.ano = data['ano'];
        this.sexo = data['sexo'];
        this.raca = data['cor_raca_autodeclarada'];
        this.modalidade = data['modalidade_ingresso'];
        this.ensino_medio = data['ensino_medio'];
        this.cursinho = data['cursinho'];
        this.cestas_basicas = data['cestas_basicas_max'];
    }

    show(x,y,size) {
        // Tamanho
        let s;
        if (isNaN(this.cestas_basicas)) {
            s = size;
        } else {
            s = map(this.cestas_basicas,0,85,size/3,size*0.8);
        }

        if (this.ensino_medio == 'exclusivamente escola particular') {
            stroke(255);
        } else {
            stroke(paletteRaca[this.raca]);
        }        

        fill(paletteRaca[this.raca]);        
        if (this.sexo == 'masculino') {
            rect(x+size/2-s/2,y+size/2-s/2,s,s);
        } else {
            ellipse(x+size/2,y+size/2,s,s);
        }

        if (this.cursinho == 'sim') {
            let cOff = 4;
            fill(0)
            if (this.sexo == 'masculino') {
                rect(x+size/2-s/2-cOff,y+size/2-s/2-cOff,s,s);
            } else {
                ellipse(x+size/2-cOff,y+size/2-cOff,s,s);
            }
        }
    }


}

