class LivroDao {

    constructor(db) {
        this._db = db;
    }

    listar() {
        return new Promise((resolve, reject) => {

            this._db.all("SELECT * FROM LIVROS", (erro, resultados) => {

                if (erro) {
                    console.log(erro);
                    return reject('Não foi possível listar os livros.');
                }

                return resolve(resultados);

            })

        });
    }

    insere(livro) {
        return new Promise((resolve, reject) => {

            this._db.run(`
            INSERT INTO LIVROS (
                    titulo,
                    preco,
                    descricao
                ) values (?, ?, ?)
            `,
                [
                    livro.titulo,
                    livro.preco,
                    livro.descricao
                ],
                function (erro) {
                    if (erro) {
                        console.log(erro);
                        return reject('Não foi possível adicionar o livro!');
                    }

                    resolve();
                }
            )

        });
    }

    buscaPorId(id) {
        return new Promise((resolve, reject) => {

            this._db.get("SELECT * FROM LIVROS WHERE ID = ?", [id], (erro, resultado) => {

                if (erro) {
                    console.log(erro);
                    return reject(`Não foi possível buscar o livro de id ${id}`);
                }

                return resolve(resultado);

            })

        });        
    }

    atualiza(livro) {
        return new Promise((resolve, reject) => {

            this._db.run(`
            UPDATE LIVROS 
              SET titulo = ?, 
                preco = ?,
                descricao = ?
              WHERE ID = ?`,
              [
                livro.titulo,
                livro.preco,
                livro.descricao,
                livro.id
              ],
                function (erro) {
                    if (erro) {
                        console.log(erro);
                        return reject('Não foi possível atualizar o livro!');
                    }

                    resolve();
                }
            )

        });        
    }

    remove(id) {
        return new Promise((resolve, reject) => {

            this._db.run(`DELETE FROM LIVROS WHERE ID = ?`,
                [id],
                function (erro) {
                    if (erro) {
                        console.log(erro);
                        return reject('Não foi possível excluir o livro!');
                    }

                    resolve();
                }
            )

        });        
    }    

}

module.exports = LivroDao;