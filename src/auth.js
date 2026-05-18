const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require ('./db')


const register = async (req, res) =>{
    const {name, email, password} = req.body
    const hashed = await bcrypt.hash(password, 10)
    
    await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2)",
    [email, hashed]
  );

  res.json({"Message": "User has been created"})
}

const login = async (req, res)=>{
    const {email, password} = req.body;
    const user = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]

    )
    if (!user.rows.length) return res.status(400).send("Invalid");

  const valid = await bcrypt.compare(password, user.rows[0].password);

  if (!valid) return res.status(400).send("Invalid Credentials");

  const token = jwt.sign(
    { userId: user.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
}


module.exports = { register, login };


