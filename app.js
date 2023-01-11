require("dotenv").config()
const express = require("express")
const Joi = require("joi")
const mysql = require("mysql")
const axios = require("axios")

pool = mysql.createPool({
    "host":process.env.MYSQL_HOST,
    "user":process.env.MYSQL_USER,
    "password":process.env.MYSQL_PASSWORD,
    "database":process.env.MYSQL_DATABASE,
})

validateData = (req, res, rules) => {
    const schema = Joi.object(rules);
    const data = schema.validate(req.body, {
        abortEarly:false
    })
    if(data.error){
        return res.status(400).send(data.error);
    }
    return null
}

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
    let v = validateData(req, res, {
        "email":Joi.string().email().required(),
        "fullName":Joi.string().required(),
        "password":Joi.string().min(8).required(),
        "access":Joi.number().min(0).max(1).required()
    })
    if(v != null){
        return v
    }
    try{
        const email = req.body.email ?? ""
        const fullName = req.body.fullName ?? ""
        const password = req.body.password ?? ""
        const access = req.body.access ?? ""
        let hasil = await executeQuery(`SELECT * from users WHERE email='${email}'`)
        if(hasil.length > 0){
            return res.status(205).send({
                "message":"Email sudah digunakan"
            })
        }
        hasil = await executeQuery(`INSERT INTO users VALUES(${null}, "${email}","${password}","${fullName}",1,${access})`)
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
    let v = validateData(req, res, {
        "email":Joi.string().email().required(),
        "password":Joi.string().required()
    })
    if(v != null){
        return v
    }   
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
                return res.status(202).send({
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



route.put('/user', async function(req, res) {
    try{
        const oldEmail = req.body.oldEmail ?? ""
        const email = req.body.email ?? ""
        const fullName = req.body.fullName ?? ""
        const password = req.body.password ?? ""
        let hasil = await executeQuery(`select * from users where email='${oldEmail}'`)
        if(hasil.length == 0){
            return res.status(401).send({
                "message":"User tidak dapat ditemukan!"
            })
        }
        const user = hasil[0]
        let query = "update users set"
        let setStatus = 0
        if(email){
            if(setStatus){
                query += ","
            }
            query += ` email='${email}'`
            setStatus = 1
        }
        if(fullName){
            if(setStatus){
                query += ","
            }
            query += ` full_name='${fullName}'`
            setStatus = 1
        }
        if(password){
            if(setStatus){
                query += ","
            }
            query += ` password='${password}'`
            setStatus = 1
        }
        query += ` where id=${user.id}`
        hasil = await executeQuery(query)
        if(hasil){
            hasil = await executeQuery(`select * from users where id=${user.id}`)
            if(hasil){
                let user = hasil[0]
                return res.status(200).send({
                    "message":"Berhasil update",
                    "email":user.email,
                    "full_name":user.full_name,
                    "status":user.status,
                    "access":user.access,
                })
            }
            return res.status(205).send({
                "message":"Gagal update"
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
})

route.post('/laporan', async function(req, res){
    let v = validateData(req, res, {
        "judul":Joi.string().required(),
        "location_id":Joi.string().required(),
        "kategori":Joi.string().required(),
        "deskripsi":Joi.any().optional(),
        "user_id":Joi.number().required(),
    })
    if(v != null){
        return v
    }
    try{
        const judul = req.body.judul ?? ""
        const location_id = req.body.location_id ?? ""
        const kategori = req.body.kategori ?? ""
        const deskripsi = req.body.deskripsi ?? ""
        const user_id = req.body.user_id ?? ""
        let hasil = await executeQuery(`INSERT INTO laporan values(${null},'${judul}','${location_id}', '${kategori}', '${deskripsi}', ${user_id}, 0)`)
        if(hasil){
            let hasil = await executeQuery(`select * from users where id=${user_id}`)
            let pelapor = hasil[0]
            delete pelapor.password
            delete pelapor.status
            delete pelapor.access
            let location__id, location__judul, location__alamat;
            (await axios.get(`https://lookup.search.hereapi.com/v1/lookup?id=${location_id}&apiKey=${process.env.HERE_API_KEY}`)
                .then(function(response){
                let location = response.data
                if(location.status){
                    return ()=>{
                        res.status(400).send({
                            "message":"Location unknown"
                        })
                    }
                }
                location__id = location.id
                location__judul = location.title
                location__alamat = location.address.label
                return ()=> {
                    console.log({
                        "id":location__id,
                        "judul":location__judul,
                        "alamat":location__alamat,
                    })
                }
            }))()
            return res.status(201).send({
                "laporan":{
                    "judul":judul,
                    "location":{
                        "id":location__id,
                        "judul":location__judul,
                        "alamat":location__alamat,
                    },
                    "kategori":kategori,
                    "deskripsi":deskripsi,
                    "pelapor":pelapor,
                }
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
})

route.get('/laporan', async function (req, res) { 
    try{
        let laporan = await executeQuery(`select laporan.judul, laporan.location_id, laporan.kategori, laporan.deskripsi, users.full_name, laporan.status from laporan JOIN users ON laporan.user_id = users.id`)
        for(let i =0 ; i < laporan.length; i++){
            let location_id = laporan[i].location_id;
            let location
            await axios.get(`https://lookup.search.hereapi.com/v1/lookup?id=${location_id}&apiKey=${process.env.HERE_API_KEY}`)
                .then((res) => {
                    let hasil = res.data
                    location = {
                        "id":hasil.id,
                        "judul":hasil.title,
                        "alamat":hasil.address.label,
                    }
                })
            console.log(location)
            laporan[i].location = location
            delete laporan[i].location_id
        }
        return res.status(200).send({
            "laporan":laporan
        })
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