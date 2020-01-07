describe("Routes: Token", function(){
    const Users = app.db.models.Users;
    
    describe("POST /token", function(){
        beforeEach(done => {
            const userTest = {
                name: "John",
                email: "john@mail.net",
                password: "12345"
            };
            Users.destroy({where: {}})
            .then(function(){
                Users.create(userTest);
            })
            .then(done());
        });
        describe("status 200", function(){
            it("returns authenticated user token", done => {
                request.post("/token")
                .send({
                    email: "john@mail.net",
                    password: "12345"
                })
                .expect(200)
                .end(function(err, res){
                    expect(res.body).to.include.keys("token");
                    done(err);
                });
            });
        });
        describe("status 401", function(){
            it("returns error when password is incorrect", done => {
                request.post("/token")
                .send({
                    email: "john@mail.net",
                    password: "senha-incorreta"
                })
                .expect(401)
                .end(function(err, res){
                    done(err);
                });
            });
            it("returns error when email not exist", done => {
                request.post("/token")
                .send({
                    email: "email-incorreto",
                    password: "senha-incorreta"
                })
                .expect(401)
                .end(function(err, res){
                    done(err);
                });
            });
            it("returns error when email and password are blank", done => {
                request.post("/token")
                .expect(401)
                .end(function(err, res){
                    done(err);
                });
            });
        });
    });
});