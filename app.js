require("dotenv").config()
const express = require("express")
const mysql = require("mysql")

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
                return reject(connectionError)
            }
            conn.query(query, (queryError, res) => {
                if(queryError){
                    conn.release();
                    return reject(queryError)
                }
                conn.release();
                return resolve(res)
            })
        })
    })
}

const app = express()
const route = express.Router()
app.use(express.urlencoded({
    extended:true
}))

route.post('/register', async function (req, res){
    try{
        const email = req.body.email ?? ""
        const fullName = req.body.fullName ?? ""
        const password = req.body.password ?? ""
        const access = req.body.access ?? ""
        //VALIDATE
        let hasil = await executeQuery(`INSERT INTO users VALUES(${null}, "${email}","${password}","${fullName}",1,${access})`)
        if(hasil){
            return res.status(201).send({
                "user":{
                    "email":email,
                    "fullName":fullName,
                    "access": access==0?"citizen":"police"
                }
            })
        }
    }
    catch (err){
        console.log(err)
        return res.status(500).send(err)
    }
})

route.post('/login', async function (req, res) { 
    try{
        const email = req.body.email ?? ""
        const password = req.body.password ?? ""
        let hasil = await executeQuery(`SELECT * FROM users where email="${email}"`)
        if(hasil.length > 0){
            if(hasil[0].password == password){
                return res.status(200).send({
                    "message":"logged in",
                    "access":hasil[0].access,
                    "email":email,
                    "fullName":hasil[0].full_name
                })
            }
            else{
                return res.status(201).send({
                    "message":"Wrong Password"
                })
            }
        }
        else{
            return res.status(202).send({
                "message":"User not found"
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
})


const port = process.env.PORT
app.use('/api', route)
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})