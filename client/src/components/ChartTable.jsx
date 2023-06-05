import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip
} from 'chart.js'

ChartJS.register(
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Tooltip
)

const ChartTable = ({ordersData}) =>{
    

    

    const data = {
        labels:ordersData.map((_, index) => `${index}`),
        datasets:[
            {
                data:ordersData.map((entry) => entry.price),
                backgroundColor:"#0047AB",
                borderColor:"#0047AB",
                pointBorderColor:"#0047AB",
                fill:true,
                tension:0.05,
                borderWidth: 2
            }
        ]
    }

    const options = {
        plugins:{
            legend:true
        },
        scales:{
            y:{
                min:1,
                max:2000
            }
        }
    }

    return(
        <>
            <div style = {{
                width:"900px",
                height:"500px",
                position:"absolute",
                top:"50%",
                left:"50%",
                transform:"translate(-50%, -50%)",
            }}>
            <Line data = {data}
            options = {options}>
            </Line>
            </div>
        </>
    )
}

export default ChartTable