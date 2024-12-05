const React = require('react');
// const DefaultLayout = require('../layout/Default')

class Index extends React.Component {
    render() {
        const { fruits } = this.props;
        // const fruits = this.props.fruits;

        return (
            // <DefaultLayout title={"Fruits Index Page"}>
            <>
                <nav>
                    <a href="/fruits/new">Create a New Fruit</a>
                </nav>
                <ul>
                    {fruits.map((fruit, i) => {
                        return (
                            <li>
                                The {' '}
                                <a href={`api/fruits/${fruit._id}`}>
                                    {fruit.name}
                                </a> {' '}
                                is {fruit.color} <br></br>
                                {fruit.readyToEat
                                ? `It is ready to eat`
                            :   `It is NOT ready to eat`}
                            <br />
                            <a href={`/fruits/${fruit._id}/edit`}>Edit This Fruit</a>
                            <form action={`api/fruits/${fruit._id}?_method=DELETE`} method="POST">
                                <input type="submit" value="DELETE"/>
                            </form>
                            </li>
                        )
                    })

                    }
                </ul>
                </>
            // </DefaultLayout>
        )
    }
}

module.exports = Index;