class Tag {
    constructor(data) {
        this.ano = data['ano'];
        this.raca = data['cor_raca_autodeclarada'];
        this.modalidade = data['modalidade_ingresso'];
        this.cestas_basicas = data['cestas_basicas_max'];
    }

    show(x,y,size) {
        fill(palette[this.modalidade]);
        noStroke();
        rect(x,y,size,size);
        let s = map(this.cestas_basicas, 0, 50, size/2, size);
        image(stickers[this.raca],x,y,s,s);
    }


}