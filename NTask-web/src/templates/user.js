exports.render = user => {
    return `<div class="list">
                <label class="item item-input item-stacked-label">
                    <span class="input-label">Nome</span>
                    <small class="dark">${user.name}</small>
                </label>
                <label class="item item-input item-stacked-label">
                    <span class="input-label">Email</span>
                    <small class="dark">${user.email}</small>
                </label>
            </div>
            <div class="padding">
                <button class="button button-positive button-block"><i class="ion-trash-a"></i> Ecluir conta</button>
            </div>`;
};