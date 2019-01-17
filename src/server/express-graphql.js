import transaction from './database/transaction.js';
import account from './database/account.js';
import schema from './schema.js';

import UserService from './service/user.js';

var graphqlHTTP = require('express-graphql');
let db = null;
let $userService = null;

var root = {
    transactions: (args) => {return transaction.all(db)},
    accounts: (args)=>{return account.all(db);},
    createUser: (args)=>{return $userService.signup(args)}
};

export default  {
    initialize: function(app){
        db = app.get('db');
        $userService = new UserService(db);
    },
    applyApiMiddleware: function(app){
        this.initialize(app);
        app.use('/api', graphqlHTTP({
            schema: schema.schema,
            rootValue: root, 
            graphiql: true
        }));
    }
}