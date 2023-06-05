The assignment is built on following assumptions:

    1: A row in a table does not represent states of a single order
    2: If a new entry has no price match in oppsite entries' group, but has price match in its own group,
    the quantity of this new entry is added to existing entry in the group.

    for example
        new_entry : {
            price:400,
            order_type:"buyer",
            quantity:20
        }

        existing entry in buyer group : 

            existing_entry: {
                price:400,
                order_type:"buyer",
                quantity:30
            }

        new_entry has no price match in seller entries, but has a match in buyer entries then: 

        existing_entry:{
            price:400,
            order_type:"buyer",
            quantity:50   //30+20
        }





Tech stack Used: 

        Front-end: 
            React JS, Formik, Yup, Material-UI, Redux toolkit
        
        Backend : 
            Node JS, Express JS, Winston, Mongoose

        Database : MongoDB



To run this project you need: 

    Node JS installed version > 16

    run the commands npm install in client and server folders

    add a config.env file in server with following keys:

    DB_URI,     //mongodb URI  
    PORT,       //port to run server
    NODE_ENV    //production or development

    to start client: npm run dev
    to start server: npm start

   Note:  project will not run on local mongodb community sever

   Can run on mongoDB Atlas

