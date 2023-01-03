require("dotenv").config()
const mysql = require("mysql")
const faker = require("@faker-js/faker").faker

pool = mysql.createPool({
    "host":process.env.MYSQL_HOST,
    "user":process.env.MYSQL_USER,
    "password":process.env.MYSQL_PASSWORD,
    "database":process.env.MYSQL_DATABASE,
})

executeQuery = (query) => {
    return new Promise( (resolve, reject) => {
        pool.getConnection( (connectionError, conn) => {
            if(connectionError){
                console.log(connectionError)
                return reject(connectionError)
            }
            conn.query(query, (queryError, res) => {
                if(queryError){
                    console.log(queryError)
                    return reject(queryError)
                }
                console.log(res)
                return resolve(res)
            })
        })
    })
}

async function seed(){
    for(let i = 0 ; i < 10 ; i++){
        let newUser = {
            "firstName":faker.name.firstName(),
            "lastName":faker.name.lastName(),
        }
        newUser.email = faker.internet.email(newUser.firstName, newUser.lastName)
        newUser.access = Math.floor(Math.random() * 100 / 80)
        var query = `INSERT INTO users VALUES(${null},"${newUser.email}","123","${newUser.firstName} ${newUser.lastName}",1,${newUser.access});`
        let x = executeQuery(await query)
        console.log(await x)
    }
}

(async function run(){
    await seed()
    process.exit(0)
})()