console.log("config");

console.log(process.env.PORT);


export const config = {
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        connectionString: process.env.DATABASE_URL,
    }
};