import { Box} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import React, {Component} from 'react'

class TempOutput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTemp: 0
        };
    }

    componentDidMount() {
    this.timer = setInterval(()=> this.getItems(), 1000);
    }
    componentWillUnmount() {
    this.timer = null; // here...
    }
    getItems() {
        let count = this.state.count
        fetch('http://localhost:5000/getInfo')
            .then(result => result.json())
            .then(result => this.setState({ currentTemp: result['currentTemperature']}));
    }
    
 render() {
   return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        textAlign: 'center',
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        cursor: 'pointer',

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        },
      })}
    >
      Current Temperature: {this.state.currentTemp}
    </Box>
   );
 }
}

   
export default TempOutput
