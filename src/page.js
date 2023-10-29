import { useState, useEffect } from "react"
import './page.css'

const Page = () => {
    const [name, setName] = useState('')
    const [datetime, setDatetime] = useState('')
    const [description, setDescription] = useState('')
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        getTransactions().then(setTransactions)
    }, [])

    async function getTransactions(){
        const url = process.env.REACT_APP_API_URL + '/transactions'
        const response = await fetch(url)
        return await response.json()
    }
    
    function addNewTransaction(e){
        // e.preventDefault()
        const url = process.env.REACT_APP_API_URL + "/transaction";
        const price = name.split(' ')[0]
        fetch(url, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                price,
                name: name.substring(price.length + 1), 
                description, 
                datetime})
        }).then(response => {
            response.json().then(json => {
                setName('')
                setDatetime('')
                setDescription('')
            })
        })
    }
    let balance = 0
    for(const transaction of transactions){
        balance = balance + transaction.price
    }

    const [dollars, cents] = balance.toString().split('.');


    return(
    <div className="input-div">
        <h1>${dollars} <span>{cents || '00'}</span></h1> 
        <form onSubmit={e => addNewTransaction(e)}>
            <div className="basic">
                <input type="text"
                value={name}
                onChange={ev => setName(ev.target.value)} placeholder={"Enter amount and Expense"}/>
                <input type="datetime-local"
                value={datetime}
                onChange={ev => setDatetime(ev.target.value)} />
            </div>
            <div>
                <input type="text"
                value={description}
                onChange={ev => setDescription(ev.target.value)} 
                placeholder={'Description of expense.'} />
            </div>
            <div>
                <button type="submit">Add new transaction</button>
                Total number of Transactions: {transactions.length}
            </div>
        </form>
        <div className="transactions">
            {transactions.length > 0 && transactions.map((transaction) => (
                <div className="transaction" key={transaction._id}>
                    <div className="left">
                        <div className="name">{transaction.name}</div>
                        <div className="description">{transaction.description}</div>
                    </div>
                    <div className="right">
                        <div className={'price '+(transaction.price>0?'green':'red')}>
                            {transaction.price}
                        </div>
                        <div className="datetime">
                            { transaction.datetime.substring(0, 10) },
                            { transaction.datetime.substring(11, 16) }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)};

export default Page