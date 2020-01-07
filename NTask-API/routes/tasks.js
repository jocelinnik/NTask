module.exports = app => {
    const Tasks = app.db.models.Tasks;

    app.route("/tasks")
    .all(app.auth.authenticate())
    /** 
     * @api {get} /tasks Lista tarefas
     * @apiGroup Tarefas
     * @apiHeader {String} Authorization Token de usuário
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiSuccess {Object[]} tasks Lista de tarefas
     * @apiSuccess {Number} tasks.id ID de registro
     * @apiSuccess {String} tasks.title Título da tarefa
     * @apiSuccess {Boolean} tasks.done Tarefa foi concluída?
     * @apiSuccess {Date} tasks.updated_at Data de atualização
     * @apiSuccess {Date} tasks.created_at Data de cadastro
     * @apiSuccess {Number} tasks.user_id ID do usuário
     * @apiSuccessExample {json} Sucesso
     *    HTTP/1.1 200 OK
     *    [{
     *        "id": 1,
     *        "title": "Estudar",
     *        "done": false,
     *        "updated_at": "2019-11-03T19:52:50.778Z",
     *        "created_at": "2019-11-03T19:52:50.778Z"
     *        "user_id": 1
     *    }]
     * @apiErrorExample {json} Erro de consulta
     *    HTTP/1.1 412 Precondition Failed
    */
    .get(function(req, res){
        // "/tasks": Lista tarefas
        Tasks.findAll({where: {user_id: req.user.id}})
        .then(result => res.json(result))
        .catch(error => {
            res.status(412).json({msg: error.message});
        });
    })
    /** 
     * @api {post} /tasks Cadastra uma tarefa
     * @apiGroup Tarefas
     * @apiHeader {String} Authorization Token de usuário
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiParam {String} title Título da tarefa
     * @apiParamExample {json} Entrada
     *    {"title": "Estudar"}
     * @apiSuccess {Number} id ID de registro
     * @apiSuccess {String} title Título da tarefa
     * @apiSuccess {Boolean} done Tarefa foi concluída?
     * @apiSuccess {Date} updated_at Data de atualização
     * @apiSuccess {Date} created_at Data de cadastro
     * @apiSuccess {Number} user_id ID do usuário
     * @apiSuccessExample {json} Sucesso
     *    HTTP/1.1 200 OK
     *    {
     *        "id": 1,
     *        "title": "Estudar",
     *        "done": false,
     *        "updated_at": "2019-11-03T19:52:50.778Z",
     *        "created_at": "2019-11-03T19:52:50.778Z"
     *        "user_id": 1
     *    }
     * @apiErrorExample {json} Erro de consulta
     *    HTTP/1.1 412 Precondition Failed
    */
    .post(function(req, res){
        // "/tasks": cadastra uma nova tarefa
        req.body.user_id = req.user.id;
        Tasks.create(req.body)
        .then(result => res.json(result))
        .catch(error => {
            res.status(412).json({msg: error.message});
        });
    });

    app.route("/tasks/:id")
    .all(app.auth.authenticate())
    /** 
     * @api {get} /tasks/:id Exibe uma tarefa
     * @apiGroup Tarefas
     * @apiHeader {String} Authorization Token de usuário
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiParam {id} id ID da tarefa
     * @apiSuccess {Number} id ID de registro
     * @apiSuccess {String} title Título da tarefa
     * @apiSuccess {Boolean} done Tarefa foi concluída?
     * @apiSuccess {Date} updated_at Data de atualização
     * @apiSuccess {Date} created_at Data de cadastro
     * @apiSuccess {Number} user_id ID do usuário
     * @apiSuccessExample {json} Sucesso
     *    HTTP/1.1 200 OK
     *    {
     *        "id": 1,
     *        "title": "Estudar",
     *        "done": false,
     *        "updated_at": "2019-11-03T19:52:50.778Z",
     *        "created_at": "2019-11-03T19:52:50.778Z"
     *        "user_id": 1
     *    }
     * @apiErrorExample {json} Tarefa não existe
     *    HTTP/1.1 404 Not Found
     * @apiErrorExample {json} Erro de consulta
     *    HTTP/1.1 412 Precondition Failed
    */
    .get(function(req, res){
        // "/tasks/1": Consulta uma tarefa
        Tasks.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        })
        .then(result => {
            if(result){
                res.json(result);
            }else{
                res.sendStatus(404);
            }
        })
        .catch(error => {
            res.status(412).json({msg: error.message});
        });
    })
    /** 
     * @api {put} /tasks/:id Atualiza uma tarefa
     * @apiGroup Tarefas
     * @apiHeader {String} Authorization Token de usuário
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiParam {id} id ID da tarefa
     * @apiParam {String} title Título da tarefa
     * @apiParam {Boolean} done Tarefa foi concluída?
     * @apiParamExample {json} Entrada
     *    {
     *        "title": "Trabalhar",
     *        "done": true
     *    }
     * @apiSuccessExample {json} Sucesso
     *    HTTP/1.1 204 No Content
     * @apiErrorExample {json} Erro na atualização
     *    HTTP/1.1 412 Precondition Failed
    */
    .put(function(req, res){
        // "/tasks/1": Atualiza uma tarefa
        Tasks.update(req.body, 
            {
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            }
        )
        .then(result => res.sendStatus(204))
        .catch(error => {
            res.status(412).json({msg: error.message});
        });
    })
    /** 
     * @api {delete} /tasks/:id Exclui uma tarefa
     * @apiGroup Tarefas
     * @apiHeader {String} Authorization Token de usuário
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiParam {id} id ID da tarefa
     * @apiSuccessExample {json} Sucesso
     *    HTTP/1.1 204 No Content
     * @apiErrorExample {json} Erro na exclusão
     *    HTTP/1.1 412 Precondition Failed
    */
    .delete(function(req, res){
        // "/tasks/1": Exclui uma tarefa
        Tasks.destroy({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        })
        .then(result => res.sendStatus(204))
        .catch(error => {
            res.status(412).json({msg: error.message});
        });
    });
};