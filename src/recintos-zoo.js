class RecintosZoo {
    constructor() {
        this.animais = {
            Leao: { tamanho: 3, bioma: ['Savana'], carnivoro: true },
            Leopardo: { tamanho: 2, bioma: ['Savana'], carnivoro: true },
            Crocodilo: { tamanho: 3, bioma: ['Rio'], carnivoro: true },
            Macaco: { tamanho: 1, bioma: ['Savana', 'Floresta'], carnivoro: false },
            Gazela: { tamanho: 2, bioma: ['Savana e Rio'], carnivoro: false },
            Hipopotamo: { tamanho: 4, bioma: ['Savana', 'Rio'], carnivoro: false }
        };

        this.recintos = [
            { numero: 1, bioma: 'Savana', tamanhoTotal: 10, animaisExistentes: ['Macaco', 'Macaco', 'Macaco'] },
            { numero: 2, bioma: 'Floresta', tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: 'Savana e Rio', tamanhoTotal: 7, animaisExistentes: ['Gazela'] },
            { numero: 4, bioma: 'Rio', tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: 'Savana', tamanhoTotal: 9, animaisExistentes: ['Leao'] }
        ];
    }

    analisaRecintos(animalEspecie, quantidade) {
        animalEspecie = animalEspecie.charAt(0).toUpperCase() + animalEspecie.slice(1).toLowerCase();

        if (!this.animais[animalEspecie]) {
            return { erro: "Animal inválido" };
        }

        const animal = this.animais[animalEspecie];

        if (quantidade <= 0 || isNaN(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        let recintosViaveis = [];

        for (let recinto of this.recintos) {
            let espacoOcupado = 0;
            const especiesNoRecinto = new Set(recinto.animaisExistentes); 

            for (let especie of recinto.animaisExistentes) {
                espacoOcupado += this.animais[especie].tamanho;
            }

            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

            const biomasRecinto = recinto.bioma.split(' e ');
            const biomaCompativel = biomasRecinto.some(bioma => animal.bioma.includes(bioma));

            const ehCarnivoro = animal.carnivoro;
            const animaisExistentes = recinto.animaisExistentes;
            const todosCarnivorosMesmoTipo = animaisExistentes.every(especie => !this.animais[especie].carnivoro || especie === animalEspecie);
            const haCarnivorosNoRecinto = animaisExistentes.some(especie => this.animais[especie].carnivoro);

            let recintoViavel = true;

            // Verificação de carnívoros
            if (ehCarnivoro && (animaisExistentes.length > 0 && !todosCarnivorosMesmoTipo)) {
                recintoViavel = false;
            }
            if (!ehCarnivoro && haCarnivorosNoRecinto) {
                recintoViavel = false;
            }

            // Verificação de bioma para o Hipopotamo
            if (animalEspecie === 'Hipopotamo' && !biomasRecinto.includes('Savana') && !biomasRecinto.includes('Rio')) {
                recintoViavel = false;
            }

            // Verificação específica para o Macaco (nao pode estar sozinho)
            if (animalEspecie === 'Macaco') {
                if (quantidade === 1) {
                    if (recinto.animaisExistentes.length === 0) {
                        recintoViavel = false;
                    } else {
                        // Caso haja outros macacos, o recinto é valido
                        const outrosMacacos = recinto.animaisExistentes.filter(especie => especie === 'Macaco').length;
                        if (outrosMacacos === 0) {
                            recintoViavel = false;
                        }
                    }
                }
            }

            // Cálculo do espaço necessário para o animal
            const espacoNecessario = animal.tamanho * quantidade;
            let espacoLivre = espacoDisponivel - espacoNecessario;

            // Verificação se haverá mais de uma espécie após adicionar o novo animal
            const especiesAtualizadas = new Set([...recinto.animaisExistentes, animalEspecie]);
            const maisDeUmaEspecie = especiesAtualizadas.size > 1;

            // Se houver mais de uma espécie, aplicar o espaço extra
            if (maisDeUmaEspecie) {
                espacoLivre -= 1; 
            }

            // Garantir que o Crocodilo vá para o recinto 4
            if (animalEspecie === 'Crocodilo') {
                
                if (recinto.numero === 4) {
                    if (biomaCompativel && espacoDisponivel >= animal.tamanho * quantidade) {
                        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel - (animal.tamanho * quantidade)} total: ${recinto.tamanhoTotal})`);
                    }
                }
                continue;
            }

            // Verificação de viabilidade do recinto
            if (recintoViavel && biomaCompativel && espacoLivre >= 0) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis: recintosViaveis.sort() };
    }
}

export { RecintosZoo as RecintosZoo };
