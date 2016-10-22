var TodoContainer = React.createClass({
	_getTodoList: function(){
		var todos = this.state.todos;
		var self = this;

		var filteredTodos = todos.filter(function(todo){
			if(self.state.showAll) {
				return todo;
			} else if (self.state.showPending) {
				return !todo.checked;
			} else {
				return todo.checked;
			}
		});

		console.log(todos);


		return filteredTodos.map(function(todo){
			return (<TodoItem 
				id={todo.id} 
				body={todo.body} 
				key={todo.id} 
				checked={todo.checked}
				/>);
		});
	},

	_handleShowAll: function() {
		console.log("show all");
		this.setState({
			showAll: true,
			showPending: false,
			showDone: false
		});
		console.log(this.state);
	},

	_handleShowPending: function() {
		console.log("show pending");
		this.setState({
			showAll: false,
			showPending: true,
			showDone: false
		});
		console.log(this.state);
	},

	_handleShowDone: function() {
		console.log("show done");
		this.setState({
			showAll: false,
			showPending: false,
			showDone: true
		});
		console.log(this.state);
	},

	handleNewTodoSubmit: function(newTodo) {
		var self = this;
		var todo = {
			id: this.state.todos.length + 1,
			body: newTodo.newTodo
		}
		$.ajax({
	      url: '/api/todos',
	      dataType: 'json',
	      type: 'POST',
	      data: todo,
	      success: function(data) {
	        self.setState({data: data});
	        console.log("new: " + todo);
	      },
	      error: function(xhr, status, err) {
	        self.setState({data: comments});
	        console.error(status, err.toString());
	      }
    	});
	},

	getInitialState: function() {
		return {
			todos: [],
			showAll: true,
			showPending: false,
			showDone: false
		};
	},

	componentDidMount: function() {
     this.loadTodosFromServer();
     setInterval(this.loadTodosFromServer, 1000);
    },

	loadTodosFromServer: function() {
		var self = this;
	    $.ajax({
	      url: "/api/todos",
	      dataType: 'json',
	      cache: false,
	      success: function(data) {
	        self.setState({todos: data});
	        console.log(self.state.todos);
	      },
	      error: function(xhr, status, err) {
	        console.error("/api/todos", status, err.toString());
	      }
	    });
  	},

	render: function() {
		var todos = this._getTodoList();
		return (<div>
					<TodoForm onNewTodoSubmit={this.handleNewTodoSubmit}/>
					<div>
						{todos}
					</div>
					<TodoFooter 
						todosLeft={todos.length} 
						handleShowAll={this._handleShowAll}
						handleShowPending={this._handleShowPending}
						handleShowDone={this._handleShowDone}
					/>
				</div>
		);
	}
});

var TodoFooter = React.createClass({
	onAllClick: function(e) {
		console.log(e);
	},


	render: function() {
		return (<div className="footer">
						<span>items left: {this.props.todosLeft}</span>
							<ul>
								<li className="active" onClick={this.props.handleShowAll}>All</li>
								<li onClick={this.props.handleShowPending}>Pending</li>
								<li onClick={this.props.handleShowDone}>Done</li>
							</ul>	
					</div>);
	}
});

var TodoItem = React.createClass({
	getInitialState: function() {
		var self = this;
    	return {todo: self.props.body};
  	},
	handleTodoDelete: function(e) {
		console.log(this.props);
		var todo = {
			id: this.props.id
		};
	    console.log("delete: " + todo);
	    $.ajax({
	      url: '/api/deleteTodo',
	      dataType: 'json',
	      type: 'POST',
	      data: todo,
	      success: function(data) {
	        console.log(data);
	      },
	      error: function(xhr, status, err) {
	        console.error(status, err.toString());
	      }
    	});
	},

	handleTodoChecked: function(e) {
		var self = this;
	    $.ajax({
	      url: '/api/updateTodo',
	      dataType: 'json',
	      type: 'POST',
	      data: {id: self.props.id},
	      success: function(data) {
	        console.log(data);
	      },
	      error: function(xhr, status, err) {
	        console.error(status, err.toString());
	      }
    	});
	},

	render: function() {
		return (<div className="item">
					<input type="checkbox" defaultChecked={this.props.checked} onClick={this.handleTodoChecked}/>
					<span className="item-body">{this.props.body}</span>
					<button onClick={this.handleTodoDelete}>remove</button>
				</div>);
	}
});

var TodoForm = React.createClass({
  	getInitialState: function() {
    	return {newTodo: ''};
  	},

  	handleNewTodoChange: function(e) {
    	this.setState({newTodo: e.target.value});
  	},

  	handleSubmit: function(e) {
	    e.preventDefault();
	    var newTodo = this.state.newTodo.trim();
	    if (!newTodo) {
	      return;
	    }
	    this.props.onNewTodoSubmit({newTodo: newTodo});
	    this.setState({newTodo: '',});
	},

	render: function() {
		return ( <form onSubmit={this.handleSubmit}>
			        <input
			          type="text"
			          placeholder="Add a new todo"
			          value={this.state.newTodo}
			          onChange={this.handleNewTodoChange}
			        />
			     </form>);
	}
});


ReactDOM.render(<TodoContainer />,document.getElementById('content'));