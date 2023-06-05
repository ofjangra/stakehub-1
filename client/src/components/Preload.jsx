

const Preload = () =>{
    return(
        <>
            <div style = {{
                position:"fixed",
                height:"100%",
                width:"100%",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                backgroundColor: "#f1f1f181"}}>
                    <img src = "/img/spinner.svg" alt = "loading..." style = {{
                        height:"120px"
                    }}/>
                </div>
        </>
    )
}

export default Preload