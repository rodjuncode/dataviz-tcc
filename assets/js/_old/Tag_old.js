class Tag {
    constructor(data) {
        this.ano = data['ano'];
        this.sexo = data['sexo'];
        this.raca = data['cor_raca_autodeclarada'];
        this.modalidade = data['modalidade_ingresso'];
        this.ensino_medio = data['ensino_medio'];
        this.cestas_basicas = data['cestas_basicas_max'];
    }

    show(x,y,size) {
        //fill(palette[this.modalidade]);
        if (isNaN(this.cestas_basicas)) {
            fill(255); // <-- muito contraste
        } else {
            let cb = floor(map(this.cestas_basicas,0,82,0,4));
            fill(paletteCestaBasica[cb]);
        }
        noStroke();
        rect(x,y,size,size);
        let s = map(this.cestas_basicas, 0, 50, size/2, size);
        // if (s === undefined) s = size;
        //let off = size/2 - s/2;
        let off = 0;
        //image(stickers[this.raca],x + off,y + off,s,s);

        image(stickers[this.raca][this.sexo],x + off,y + off,size-off*2,size-off*2);
        // if (this.sexo == 'masculino') {
        //     fill(255,255,0);
        // } else {
        //     fill(0,255,255);
        // }
        // rect(x+(size/2.5),y+(size/2.5),size/5,size/5);
        // if (this.ensino_medio == 'exclusivamente escola particular') {
        //     fill("#F7C700")
        //     ellipse(x+size/2,y+size/2,size/3.5);
        // }
    }


}