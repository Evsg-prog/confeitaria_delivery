
const layoutHTML = `

    <div class="layoutcontainer">

        <aside id="sidebar">

            <button id="botao-menu" type="button"
                aria-label="Abrir menu"
                aria-expanded="false">

                <i class="fa-solid fa-bars"></i>
                <i class="fa-solid fa-xmark"></i>

            </button>

            <ul>
                <li>
                    <a href="./index.html">
                        <i class="fa-solid fa-house"></i>
                        <span>Home</span>
                    </a>
                </li>

                <li>
                    <a href="./cardapio.html">
                        <i class="fa-solid fa-book"></i>
                        <span>Cardápio</span>
                    </a>
                </li>

                <li>
                    <a href="./pedidos.html">
                        <i class="fa-solid fa-shopping-cart"></i>
                        <span>Pedidos</span>
                    </a>
                </li>

                <li>
                    <a href="./usuarios.html">
                        <i class="fa-solid fa-users"></i>
                        <span>Usuários</span>
                    </a>
                </li>
            </ul>

        </aside>

        <header></header>

        <main id="main-content"></main>

        <footer>
            <h3>Footer</h3>
        </footer>

    </div>

`;


/* Procura os elementos que receberão o layout e o conteúdo */

const app = document.querySelector('#app');
const modeloConteudo = document.querySelector('#page-content');


/* Insere a estrutura na página */

if (!app || !modeloConteudo) {

    console.error('Não foi possível encontrar os elementos necessários.');

} else {

    app.innerHTML = layoutHTML;

    const main = app.querySelector('#main-content');

    main.append(modeloConteudo.content.cloneNode(true));


    /* Funcionalidade da sidebar */

    const botaoMenu = app.querySelector('#botao-menu');
    const sidebar = app.querySelector('#sidebar');

    botaoMenu.addEventListener('click', () => {

        const aberto = sidebar.classList.toggle('sidebar-aberto');

        botaoMenu.setAttribute('aria-expanded', aberto);

        botaoMenu.setAttribute(
            'aria-label',
            aberto ? 'Fechar menu' : 'Abrir menu'
        );

    });

}
