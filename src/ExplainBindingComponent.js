class ExplainBindingsComponent extends Component {
  onClickMe = () => {
    console.log(this)
  }

  render() {
    return (
      <button onClick={this.onClickMe} type="button">
        Click Me
      </button>
    );
  }
}
