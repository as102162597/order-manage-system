export const config = {
    development: {
        dbms: {
            dialect:    'mysql',
            host:       'localhost',
            port:       3306,
            username:   'root',
            password:   '0000',
            database:   'order_manage_system'
        },
        server: {
            host: '0.0.0.0',
            port: 3000
        }
    }
};
