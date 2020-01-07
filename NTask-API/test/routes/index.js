describe("Routes: Index", function(){
    describe("GET /", function(){
        it("returns the API status", done => {
            request.get("/")
            .expect(200)
            .end(function(err, res){
                const expected = {status: "NTask API"};
                expect(res.body).to.eql(expected);
                done(err);
            });
        });
    });
});