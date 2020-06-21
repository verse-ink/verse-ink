describe('Inline Simple', function () {
    const firstBlock = () => cy.get('.public-DraftStyleDefault-block');

    it('renders simple line text', function () {
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('abcdefg');
        firstBlock().type('{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{leftarrow}');
        firstBlock().then((el) => expect(el).text('abcdefg'));
    })
    it('renders strong', function () {
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('**abcdefg** ');
        firstBlock().find("span[style=\"font-weight: bold;\"]").then(
            (el) => expect(el).text('abcdefg'));
        firstBlock().find("span[style=\"font-size: 0px;\"]:contains('**')").each(
            (el) => expect(el).text('**'));

        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('__abcdefg__ ');
        firstBlock().find("span[style=\"font-weight: bold;\"]").then(
            (el) => expect(el).text('abcdefg'));
        firstBlock().find("span[style=\"font-size: 0px;\"]:contains('__')").each(
            (el) => expect(el).text('__'));
    })
    it("renders strike through",()=>{
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type(' ~~asdfasdf aa~~ ');
        firstBlock().find("span[style=\"text-decoration: line-through;\"]").then(
            (el) => expect(el).text('asdfasdf aa'));
    })
    it("renders escape",()=>{
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type('   \\*ajfoiejwofjoewjfoajg;broe*');
        firstBlock().then((el) => expect(el).text('   \\*ajfoiejwofjoewjfoajg;broe*'));
        firstBlock().find("span[style=\"font-size: 0px;\"]").then(el=>expect(el).text("\\"));
    })
    it("renders em", ()=>{
        cy.visit('http://127.0.0.1:3000');
        firstBlock().type(' _asdf_ ');
        firstBlock().find("span[style=\"font-style: italic;\"]").then(
            (el) => expect(el).text('asdf'));

        cy.visit('http://127.0.0.1:3000');
        firstBlock().type(' *asdf* ');
        firstBlock().find("span[style=\"font-style: italic;\"]").then(
            (el) => expect(el).text('asdf'));
    })


})