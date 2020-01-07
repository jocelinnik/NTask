const jwt = require("jwt-simple");

describe("Routes: Tasks", function(){
    const Users = app.db.models.Users;
    const Tasks = app.db.models.Tasks;
    const jwtSecret = app.libs.config.jwtSecret;
    let token;
    let fakeTask;

    beforeEach(done => {
        Users.destroy({where: {}})
        .then(function(){
            Users.create({
                name: "John",
                email: "john@mail.net",
                password: "12345"
            })
        })
        .then(user => {
            Tasks.destroy({where: {}})
            .then(function(){
                Tasks.bulkCreate([
                    {
                        id: 1,
                        title: "Work",
                        user_id: user.id
                    },
                    {
                        id: 2,
                        title: "Study",
                        user_id: user.id
                    }
                ]);
            })
            .then(tasks => {
                fakeTask = tasks[0];
                token = jwt.encode({id: user.id}, jwtSecret);
                done();
            });
        });
    });
    describe("GET /tasks", function(){
        describe("status 200", function(){
            it("returns a list of tasks", done => {
                request.get("/tasks")
                .set("Authorization", "JWT " + token.trim())
                .expect(200)
                .end(function(err, res){
                    expect(res.body).to.have.length(2);
                    expect(res.body[0].title).to.eql("Work");
                    expect(res.body[1].title).to.eql("Study");
                    done(err);
                });
            });
        });
    });
    describe("POST /tasks", function(){
        describe("status 200", function(){
            it("creates a new task", done => {
                request.post("/tasks")
                .set("Authorization", "JWT " + token.trim())
                .expect(200)
                .end(function(err, res){
                    expect(res.body.title).to.eql("Run");
                    expect(res.body.done).to.be.false;
                    done(err);
                });
            });
        });
    });
    describe("GET /tasks/:id", function(){
        describe("status 200", function(){
            it("returns one task", done => {
                request.get("/tasks/" + fakeTask.id)
                .set("Authorization", "JWT " + token.trim())
                .expect(200)
                .end(function(err, res){
                    expect(res.body.title).to.eql("Work");
                    done(err);
                });
            });
        });
        describe("status 404", function(){
            it("throws error when task not exist", done => {
                request.get("/tasks/0")
                .set("Authorization", "JWT " + token.trim())
                .expect(404)
                .end(function(err, res){
                    done(err);
                });
            });
        });
    });
    describe("PUT /tasks/:id", function(){
        describe("status 204", function(){
            it("updates a task", done => {
                request.put("/tasks/" + fakeTask.id)
                .set("Authorization", "JWT " + token.trim())
                .send({
                    title: "Travel",
                    done: true
                })
                expect(204)
                .end(function(err, res){
                    done(err);
                });
            });
        });
    });
    describe("DELETE /tasks/:id", function(){
        describe("status 204", function(){
            it("removes a task", done => {
                request.delete("/tasks/" + fakeTask.id)
                .set("Authorization", "JWT " + token.trim())
                expect(204)
                .end(function(err, res){
                    done(err);
                });
            });
        });
    });
});