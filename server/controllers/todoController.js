const db = require('../config/database');



// Create a new todo

exports.createTodo = async (req, res) => {

    const { user_id, title, description, due_date } = req.body;



    try {

        // Validate required fields

        if (!title) {

            return res.status(400).json({ error: 'Title is required' });

        }



        const result = await db.query(

            'INSERT INTO todos (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',

            [user_id, title, description || null, due_date || null]

        );

        const newTodo = result.rows[0];



        res.status(201).json({

            message: 'Todo created successfully',

            todo: newTodo

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Server error' });

    }

};



// Get all todos for a user with auto-overdue detection

exports.getUserTodos = async (req, res) => {

    const { user_id } = req.params;



    try {

        const result = await db.query(

            'SELECT * FROM todos WHERE user_id = $1 ORDER BY is_completed ASC, due_date ASC NULLS LAST, created_at DESC',

            [user_id]

        );

        const todos = result.rows;



        // Add is_overdue flag

        const today = new Date().toISOString().split('T')[0];

        const todosWithOverdue = todos.map(todo => ({

            ...todo,

            is_overdue: todo.due_date && todo.due_date < today && !todo.is_completed

        }));



        res.status(200).json({

            todos: todosWithOverdue

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Server error' });

    }

};



// Update a todo

exports.updateTodo = async (req, res) => {

    const { id } = req.params;

    const { title, description, due_date } = req.body;



    try {

        // Check if todo exists

        const existingResult = await db.query('SELECT * FROM todos WHERE id = $1', [id]);

        const existingTodo = existingResult.rows[0];



        if (!existingTodo) {

            return res.status(404).json({ error: 'Todo not found' });

        }



        // Update todo

        const result = await db.query(

            'UPDATE todos SET title = $1, description = $2, due_date = $3 WHERE id = $4 RETURNING *',

            [title, description || null, due_date || null, id]

        );

        const updatedTodo = result.rows[0];



        res.status(200).json({

            message: 'Todo updated successfully',

            todo: updatedTodo

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Server error' });

    }

};



// Toggle todo completion status

exports.toggleTodoCompletion = async (req, res) => {

    const { id } = req.params;



    try {

        // Check if todo exists

        const existingResult = await db.query('SELECT * FROM todos WHERE id = $1', [id]);

        const existingTodo = existingResult.rows[0];



        if (!existingTodo) {

            return res.status(404).json({ error: 'Todo not found' });

        }



        // Toggle completion status

        const result = await db.query(

            'UPDATE todos SET is_completed = $1 WHERE id = $2 RETURNING *',

            [!existingTodo.is_completed, id]

        );

        const updatedTodo = result.rows[0];



        res.status(200).json({

            message: 'Todo status updated successfully',

            todo: updatedTodo

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Server error' });

    }

};



// Delete a todo

exports.deleteTodo = async (req, res) => {

    const { id } = req.params;



    try {

        // Check if todo exists

        const existingResult = await db.query('SELECT * FROM todos WHERE id = $1', [id]);

        const deletedTodo = existingResult.rows[0];



        if (!deletedTodo) {

            return res.status(404).json({ error: 'Todo not found' });

        }



        // Delete todo

        await db.query('DELETE FROM todos WHERE id = $1', [id]);



        res.status(200).json({

            message: 'Todo deleted successfully',

            todo: deletedTodo

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Server error' });

    }

};



// Get todo statistics for a user

exports.getTodoStats = async (req, res) => {

    const { user_id } = req.params;



    try {

        const result = await db.query(

            'SELECT is_completed, due_date FROM todos WHERE user_id = $1',

            [user_id]

        );

        const allTodos = result.rows;



        const totalTodos = allTodos.length;

        const completedTodos = allTodos.filter(todo => todo.is_completed).length;

        const pendingTodos = totalTodos - completedTodos;



        // Calculate overdue todos

        const today = new Date().toISOString().split('T')[0];

        const overdueTodos = allTodos.filter(todo => 

            todo.due_date && todo.due_date < today && !todo.completed

        ).length;



        res.status(200).json({

            totalTodos,

            completedTodos,

            pendingTodos,

            overdueTodos

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Server error' });

    }

};

