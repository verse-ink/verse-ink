const firstBlock = () => cy.get('.public-DraftStyleDefault-block');
const existTextWithStyle = function (text, style, block) {
    block = block || firstBlock();
    block.find(`span[style=\"${style}\"]:contains('${text}')`).should(els => {
        expect(els.length).to.be.greaterThan(0);
        for(let i=0;i<els.length;i++){
            if(cy.$$(els[i]).text()===text){
                return;
            }
        }
        expect(false).equal(true);
    });
};

describe('Inline Style', function () {
    it('renders simple line text', function () {
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('abcdefg');
        firstBlock().then((el) => expect(el).text('abcdefg'));
    });
    it('renders strong', function () {
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('**abcdefg** __hijklmn__ www');
        existTextWithStyle('abcdefg', 'font-weight: bold;');
        existTextWithStyle('hijklmn', 'font-weight: bold;');
        existTextWithStyle('**', 'font-size: 0px;');
        existTextWithStyle('__', 'font-size: 0px;');
    });
    it("renders strike through", () => {
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type(' ~~asdfasdf aa~~ ');
        existTextWithStyle('asdfasdf aa', 'text-decoration: line-through;');
    });
    it("renders escape", () => {
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('   \\*ajfoiejwofjoewjfoajg;broe*');
        firstBlock().then((el) => expect(el).text('   \\*ajfoiejwofjoewjfoajg;broe*'));
        firstBlock().find("span[style=\"font-size: 0px;\"]").then(el => expect(el).text("\\"));
    });
    it("renders em", () => {
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type(' _asdf_ ');
        existTextWithStyle('asdf', 'font-style: italic;');
    });
    it("renders code",()=>{
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type(' `asdf` ');
        existTextWithStyle('asdf', 'font-family: monospace; overflow-wrap: break-word;');
    });
    it("renders image",()=>{
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('![google](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)');
        const img = cy.get('img');

    });
    it("renders link",()=>{
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('[_google_](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)');
    });
});