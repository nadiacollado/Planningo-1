import React, { Component } from "react";
import { connect } from "react-redux";
import { FaTimes } from 'react-icons/fa';
import { updateGroupTaskThunk, fetchTasksThunk } from "../../store/tasks";
import "../Tasks/taskmodal.css";
import { fetchSingleGroupTasks } from "../../store/singleGroup";
import KeyboardDatePickerTab from "../Calendar/DatePicker";

class UpdateGroupTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.task.name,
      userId: "",
      description: this.props.task.description,
      points: this.props.task.points,
      categoryId: this.props.task.categoryId,
      selectedDate: `${this.props.task.start}T12:00:00.000Z`,
      taskId: this.props.task.id,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(newValue) {
    this.setState({
      selectedDate: newValue,
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    try {
      if (this.state.name == "") {
        alert("Task name can't be empty!");
        return false;
      } else {
        await this.props.updateGroupTask(this.state, this.props.group.id);
        alert(`Task was updated! Redirecting you to the tasks page.`);
        await this.props.fetchGroup(this.props.group.id);
        this.props.onClose();
      }
    } catch (err) {
      console.log("error creating task", err);
    }
  }

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    let group = this.props.group;
    let categories = group && group.categories;

    if (!this.props.showTask || !this.props.selectedTask) {
      return null;
    }
    return (
      <div>
        <div>{this.props.children}</div>
        <div className="task-modal-content">
          <div id="top-taskmodal-div">
            <div id="modal-title">
              UPDATE {this.props.task.isShopping === false ? "TASK" : "ITEM"}{" "}
            </div>
            <button
              onClick={(e) => this.onClose(e)}
              className="close-modal-btn"
            >
              <FaTimes/>
            </button>
          </div>

          <div id="lower-taskmodal-div">
            <form id="add-task-form" onSubmit={this.handleSubmit}>
              <label htmlFor="name">
                {this.props.task.isShopping === false ? "Task:" : "Item:"}
              </label>
              <input
                name="name"
                type="text"
                className="modal-input"
                onChange={this.handleChange}
                value={this.state.name}
              />

              <label htmlFor="description">Description:</label>
              <textarea
                name="description"
                type="text"
                rows="4"
                className="modal-input"
                onChange={this.handleChange}
                value={this.state.description}
              />
              {this.props.task.isShopping === false ? (
                <div>
                  <label htmlFor="points">Points:</label>
                  <textarea
                    name="points"
                    type="text"
                    className="modal-input"
                    onChange={this.handleChange}
                    value={this.state.points}
                  />
                </div>
              ) : null}

              <label htmlFor="userId"></label>
              <select
                onChange={(e) =>
                  this.setState({ userId: e.target.value || null })
                }
                value={this.state.userId || ""}
                name="userId"
              >
                <option value="" disabled>
                  Select User
                </option>
                {group && group.users
                  ? group.users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))
                  : "There are no users"}
              </select>
              <KeyboardDatePickerTab
                selectedDate={this.state.selectedDate}
                handleDateChange={this.handleDateChange}
              />
              <button id="modal-submit-button" type="submit">
                Update
              </button>
              <div id="modal-category-wrap">
                <label htmlFor="categoryId">Category:</label>

                <select
                  onChange={(e) =>
                    this.setState({ categoryId: e.target.value || null })
                  }
                  value={this.state.categoryId || ""}
                  name="categoryId"
                  className="choose-category"
                >
                  <option value="">None</option>
                  {this.props.task.isShopping === false
                    ? categories
                        .filter((category) => {
                          return category.isShopping === false;
                        })
                        .map((category) => {
                          return (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          );
                        })
                    : categories
                        .filter((category) => {
                          return category.isShopping === true;
                        })
                        .map((category) => {
                          return (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          );
                        })}

                  {/* {this.props.task.isShopping === false
                    ? categories
                      ? categories
                          .filter((category) => {
                            return category.isShopping === false;
                          })
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                      : null
                    : categories
                    ? categories
                        .filter((category) => {
                          return category.isShopping === true;
                        })
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                    : null} */}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  userId: state.user.id,
  group: state.singleGroup,
});

const mapDispatch = (dispatch) => ({
  fetchGroup: (groupId) => dispatch(fetchSingleGroupTasks(groupId)),
  updateGroupTask: (task, groupId) =>
    dispatch(updateGroupTaskThunk(task, groupId)),
});

export default connect(mapState, mapDispatch)(UpdateGroupTaskModal);
