import { createRef, useEffect } from 'react';
import { useQuery } from "@apollo/client"
import { GET_USER, GET_PROGRESSES, GET_TRANSACTIONS } from "../queries"
import { LineChart } from "../utilities/LineChart"

// Credit to Olari and Robert
// Calculates what level this amount of XP would be at
function calculateLevel(xp) {
    let level = 0

    while (levelNeededXP(++level) < xp) {}

    return level+1
    // return level-1
}

// Credit to Olari and Robert
// Returns the amount of XP needed for any given level
function levelNeededXP(level) {
    return Math.round(level * (176 + 3 * level * (47 + 11 * level)))
}

const UserInfo = ({username}) => {
    const myRef = createRef()

    const userInfo = useQuery(GET_USER, {
        variables: {
            username: username
        }
    })

    const progressesInfo = useQuery(GET_PROGRESSES, {
        variables: {
            username: username
        }
    })
    console.log("🚀 ~ file: UserInfo.js ~ line 38 ~ UserInfo ~ progressesInfo", progressesInfo)

    const transactionsInfo = useQuery(GET_TRANSACTIONS, {
        variables: {
            username: username
        }
    })
    console.log("🚀 ~ file: UserInfo.js ~ line 45 ~ UserInfo ~ transactionsInfo", transactionsInfo)

    let resultTable = []
    let totalXp = 0
    let totalLv = 0
    if (progressesInfo.data && transactionsInfo.data && progressesInfo.data.user.length) {
        progressesInfo.data.user[0].progresses.forEach((progress)=>{
            const firstRustPiscine = progress.path === "/johvi/div-01/rust"
            transactionsInfo.data.user[0].transactions.forEach((transaction)=>{
                const found = resultTable.find((element) => element.path === progress.path)
                if (progress.path === transaction.path && !found) {
                    resultTable.push({
                        path: progress.path,
                        isDone: progress.isDone,
                        amount: transaction.amount,
                        createdAt: transaction.createdAt,
                    })
                } else if (firstRustPiscine && transaction.path === "/johvi/div-01" && !found) {
                    resultTable.push({
                        path: progress.path,
                        isDone: progress.isDone,
                        amount: 390000,
                        createdAt: transaction.createdAt,
                    })
                }
            })
        })
        resultTable.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
        resultTable = resultTable.map((element) => {
            totalXp += element.amount
            totalLv = calculateLevel(totalXp)
            return {...element, totalXp, totalLv}
        })
    }

    console.log("result table is ...", resultTable)

    // calculate total amount from resultTable
    let totalAmount = 0
    resultTable.forEach((result)=>{
        totalAmount += result.amount
    })

    let level = calculateLevel(totalAmount)

    useEffect(() => {
        if (resultTable && myRef.current) {
          myRef.current.innerHTML = ''
          let chart = LineChart(resultTable, {
              x: d => Date.parse(new Date(d.createdAt)),
              y: d => d.totalXp,
              yLabel: "Total XP",
              height: 500,
              color: "black",
          })
          chart.classList.add("total-xp-chart")
          myRef.current.append(chart)
          chart = LineChart(resultTable, {
              x: d => Date.parse(new Date(d.createdAt)),
              y: d => d.totalLv,
              yLabel: "Level progress",
              height: 500,
              color: "black",
          })
          chart.classList.add("total-lv-chart")
          myRef.current.append(chart)
        }
      }, [myRef])

    if (totalAmount && level) {
        return (<>
            <h2>Username: {userInfo.data.user[0].login}</h2>
            <h2>Total XP: {totalAmount}</h2>
            <h2>Total Level: {level}</h2>
            <div ref={myRef}/>
        </>)
    } else {
        return <></>
    }
}

export default UserInfo