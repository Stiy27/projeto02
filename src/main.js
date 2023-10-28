import api from './api';

class App{
    //Construtor
    constructor(){
        //Lista de repositórios/projeto do github
        this.repositorios = [];

        //Recupera o formulário da página
        this.formulario = document.querySelector('form');

        //Recupera a lista da página
        this.lista = document.querySelector('.list-group');

        //Resgistra os eventos do formulário
        this.registrarEventos();
    }

    registrarEventos() {
        this.formulario.onsubmit = evento => this.adicionarRepositório(evento);
    }

    async adicionarRepositório(evento){
        //Evita a recarga da página após submeter o formulário
        evento.preventDefault();

        //Recupera o valor do input do usuário
        let input = this.formulario.querySelector('input[id=repositorio]').value;
        
        //Se o input vier vazio, sai da aplicação, lembrando que na página é obrigatório passar informação
        if (input.length === 0){
            return; //Sempre sai da função
        }

        //Ativa o alerta de busca/pesquisa
        this.executarBusca()

        try {
            //Adiciona/concatena o input ao final da URL da ./api.js
            let response = await api.get(`/repos/${input}`);
            //console.log(response);

            //Dados adquiridos de response, visualisavel no console do browser
            let { name, description, html_url, owner: {avatar_url} } = response.data;

            //Adiciona o repositório na lista
            this.repositorios.push({
                nome: name,
                descricao: description,
                avatar_url: avatar_url,
                link: html_url,
            });

            //Renderiza a tela/página
            this.renderizarTela();
        }
        catch(erro){
            //Limpa erros existente de busca
            let er = this.lista.querySelector('.list-group-item-danger');

            //Limpa o alerta
            this.lista.removeChild(document.querySelector('.list-group-item-warning'));

            if (er !== null){
                this.lista.removeChild(er);
            }

            //Adiociona o alerta de erro em <li> se não encontrar repositório.
            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-danger');
            let txtErro = document.createTextNode(`O repositório ${input} não existe.`);
            li.appendChild(txtErro);
            this.lista.appendChild(li);
        }
    }

    executarBusca(){
        //Informa que está procurando pelo repositório.
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item list-group-item-warning');
        let txtBuscando = document.createTextNode(`Procurando por repositório...`);
        li.appendChild(txtBuscando);
        this.lista.appendChild(li);
    }

    renderizarTela(){
        //Limpa a lista antes de renderizar
        this.lista.innerHTML = '';

        //Percorre a lista de repositórios e cria os elementos
        this.repositorios.forEach(repositorio => {
            //Cria o item/elemento <li> da lista
            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-action');

            //Cria o item/Elemento <img>
            let img = document.createElement('img');
            img.setAttribute('src', repositorio.avatar_url);
            //Adiciona o filho <img> à lista <li>
            li.appendChild(img);

            //Cria o item/Elemento <strong>
            let strong = document.createElement('strong');
            let txtNome = document.createTextNode(repositorio.nome);
            strong.appendChild(txtNome);
            li.appendChild(strong);

            //Cria o item/Elemento <p>
            let p = document.createElement('p');
            let txtDescricao = document.createTextNode(repositorio.descricao)
            p.appendChild(txtDescricao)
            li.appendChild(p);

            //Cria o Elemento <a>
            let a = document.createElement('a');
            a.setAttribute('href', repositorio.link);
            a.setAttribute('target', '_blank');
            let txtAcessar = document.createTextNode('Acessar');
            a.appendChild(txtAcessar);
            li.appendChild(a);

            //Adiciona o item/Elemento <li> como filho da Lista <ul>
            this.lista.appendChild(li);

            //Limpa o INPUT do usuário
            this.formulario.querySelector('input[id=repositorio]').value = '';

            //Adiciona o foco no input do usuário
            this.formulario.querySelector('input[id=repositorio]').focus();

        });
    }
}

new App();
