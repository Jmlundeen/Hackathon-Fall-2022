import { Box} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import React, {Component} from 'react'

class ETAOutput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eta: 0
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
            .then(result => this.setState({ eta: result['eta']}));
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
      ETA Before Reaching Temp: {this.state.eta}
    </Box>
   );
 }
}

   
export default ETAOutput
