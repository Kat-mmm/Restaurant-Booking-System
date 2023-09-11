const restaurant = (db) => {

    async function getTables() {
        // get all the available tables
        let tables = await db.any(`SELECT * FROM table_booking`);
        return tables
    }

    async function bookTable({ tableName, username, phoneNumber, seats }) {
        // Get the table by name
        const table = await db.any(`SELECT * from table_booking WHERE table_name = $1`, [tableName]);
    
        // Check if the username has been provided
        if (!username) {
            return 'Please enter a username';
        }

        // Check if the phone number has been provided
        if (!phoneNumber) {
            return 'Please enter a contact number';
        }

        // Check if it's a valid table name 
        if (!table || table.length === 0) {
            return "Invalid table name provided";
        }
    
        // Check if the seats are not more than the capacity
        if (seats > table[0].capacity) {
            return 'capacity greater than the table seats';
        }
    
        //make the phone number an integer
        const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');

        //update the booking information
        if(table[0].booked === false){
            await db.none('UPDATE table_booking SET booked = $1, username = $2, number_of_people = $3, contact_number = $4 WHERE id = $5', ['t', username, seats, formattedPhoneNumber, table[0].id]);
        }
    }    

    async function getBookedTables() {
        // get all the booked tables
        let bookedTables = await db.any(`SELECT * FROM table_booking WHERE booked = true`)

        return bookedTables
    }

    async function isTableBooked(tableName) {
        // get booked table by name
        let table = await db.any(`SELECT * FROM table_booking WHERE table_name = $1`, [tableName])

        return table[0].booked
    }

    async function cancelTableBooking(tableName) {
        // cancel a table by name
    }

    async function getBookedTablesForUser(username) {
        // get user table booking
        let bookedTableForUser = await db.any(`SELECT * FROM table_booking WHERE username = $1`, [username])

        return bookedTableForUser
    }

    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        // editTableBooking,
        getBookedTablesForUser
    }
}

export default restaurant;