import React, {PureComponent} from 'react';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';
import Grid from 'grid-styled';
import {Link, Redirect} from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';

const buttonStyle = {
    margin: '.5em'
};

const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'row-reverse'
};

const checkboxStyle = {
    block: {
        maxWidth: 250,
    },
    checkbox: {
        marginBottom: 16,
    },
};

const containerStyle = {
    display: 'flex',
    justifyContent: 'center'
};

class DayBoxes extends PureComponent {
    constructor(props) {
        super(props);
        this.state = this.getStateFromDays(props.days)

    }

    getStateFromDays(days) {
        let splitDays = days.split('');
        let state = {
            weekString: days,
            monday: _.includes(splitDays, '0'),
            tuesday: _.includes(splitDays, '1'),
            wednesday: _.includes(splitDays, '2'),
            thursday: _.includes(splitDays, '3'),
            friday: _.includes(splitDays, '4'),
            saturday: _.includes(splitDays, '5'),
            sunday: _.includes(splitDays, '6')
        };
        return state
    }

    handleChange(state, event, value) {
        let newState = {};
        newState[state] = value;
        newState = _.extend({}, this.state, newState);
        let weekString = this.formatWeekString(newState);
        newState.weekString = weekString;
        this.setState(newState);
        this.props.onStateChange(null, weekString);
    }

    formatWeekString(state) {
        let weekString = '';
        if (state.monday) {
            weekString += '0';
        }
        if (state.tuesday) {
            weekString += '1';
        }
        if (state.wednesday) {
            weekString += '2';
        }
        if (state.thursday) {
            weekString += '3';
        }
        if (state.friday) {
            weekString += '4';
        }
        if (state.saturday) {
            weekString += '5';
        }
        if (state.sunday) {
            weekString += '6';
        }
        return weekString;
    }


    render() {
        return (
            <div>
                    <Grid xs={0} md={0} lg={1/9}>
                        <div>
                        </div>
                    </Grid>

                    <Grid xs={1} md={1} lg={1/9}>
                    <Checkbox
                        label="Sunday"
                        style={checkboxStyle.checkbox}
                        onCheck={this.handleChange.bind(this, 'sunday')}
                        checked={this.state.sunday}
                    />
                    </Grid>

                    <Grid xs={1} md={1} lg={1/9}>
                    <Checkbox
                        label="Monday"
                        style={checkboxStyle.checkbox}
                        onCheck={this.handleChange.bind(this, 'monday')}
                        checked={this.state.monday}
                    />
                    </Grid>

                    <Grid xs={1} md={1} lg={1/9}>
                    <Checkbox
                        label="Tuesday"
                        style={checkboxStyle.checkbox}
                        onCheck={this.handleChange.bind(this, 'tuesday')}
                        checked={this.state.tuesday}
                    />
                    </Grid>

                    <Grid xs={1} md={1} lg={1/9}>
                    <Checkbox
                        label="Wednesday"
                        style={checkboxStyle.checkbox}
                        onCheck={this.handleChange.bind(this, 'wednesday')}
                        checked={this.state.wednesday}
                    />
                    </Grid>

                    <Grid xs={1} md={1} lg={1/9}>
                    <Checkbox
                        label="Thursday"
                        style={checkboxStyle.checkbox}
                        onCheck={this.handleChange.bind(this, 'thursday')}
                        checked={this.state.thursday}
                    />
                    </Grid>

                    <Grid xs={1} md={1} lg={1/9}>
                    <Checkbox
                        label="Friday"
                        style={checkboxStyle.checkbox}
                        onCheck={this.handleChange.bind(this, 'friday')}
                        checked={this.state.friday}
                    />
                    </Grid>

                    <Grid xs={1} md={1} lg={1/9}>
                    <Checkbox
                        label="Saturday"
                        style={checkboxStyle.checkbox}
                        onCheck={this.handleChange.bind(this, 'saturday')}
                        checked={this.state.saturday}
                    />
                    </Grid>
            </div>
        )
    }
}


class EditSchedule extends PureComponent {
    constructor(props) {
        super(props);
        let schedules = props.schedules;
        this.state = {
            name: '',
            containerSize: '',
            startTime: null,
            waterAmount: '',
            interval: '',
            minTemp: '',
            minMoisture: '',
            maxMoisture: '',
            days: '',
            errors: {}
        };
        if (props.scheduleId) {
            let tmp = _.find(schedules, {id: parseInt(props.scheduleId)});
            if (!tmp) {
                this.state.invalidId = true;
                return;
            }

            let schedule = _.extend({}, tmp);
            let startTime = moment.utc(schedule.startTime, 'HHmm');
            if (!startTime.isValid()) {
                startTime = moment();
            }
            startTime = startTime.toDate();
            schedule.startTime = startTime;
            delete schedule.id;
            this.state = schedule;
        }
        this.state.errors = {
            name: this.isInvalidString(this.state.name),
            containerSize: this.isInvalidNumber(this.state.containerSize),
            startTime: this.isInvalidString(this.state.startTime),
            waterAmount: this.isInvalidNumber(this.state.waterAmount),
            interval: this.isInvalidNumber(this.state.interval),
            minTemp: this.isInvalidNumber(this.state.minTemp),
            minMoisture: this.isInvalidPercent(this.state.minMoisture),
            maxMoisture: this.isInvalidPercent(this.state.maxMoisture)
        }
    }

    isInvalidString(value)
    {
        if(value === '' || value === null)
            return 'Field cannot be empty.';
        else
            return null;
    }

    isInvalidNumber(value)
    {
        if(value === '' || value === null)
            return 'Field cannot be empty.';
        else {
            if (value < 0)
                return 'Field cannot contain negative numbers.';
            else
                return null;
        }
    }

    isInvalidPercent(value)
    {
        if(value === '' || value === null)
            return 'Field cannot be empty';
        else {
            if(value < 0 || value > 100)
                return 'Entry should be a number from 0 to 100.';
            else
                return null;
        }
    }


    handleChange = (validate, state, event, value) => {
        let newState = _.extend({}, this.state);
        newState[state] = value;
        if (validate) {
            newState.errors[state] = validate(value);
        } else {
            newState.errors[state] = null;
        }
        this.setState(newState);
    };

    render() {
        if (this.state.invalidId) {
            return <Redirect to={this.props.onCancel}/>
        }

        return (
            <div style={{padding: '1em 0 1em 0'}}>
                <Grid xs={1} style={containerStyle}>
                    <h2>{this.props.scheduleId ? 'Edit Schedule' : 'New Schedule'}</h2>
                </Grid>
                <Grid xs={1} md={1/2} lg={1/3}>
                    <TextField
                        floatingLabelText="Schedule Name"
                        value={this.state.name}
                        onChange={this.handleChange.bind(this, this.isInvalidString, 'name')}
                        errorText={this.state.errors.name}
                    />
                </Grid>

                <Grid xs={1} md={1/2} lg={1/3}>
                    <TextField
                        floatingLabelText="Pot Size"
                        value={this.state.containerSize}
                        type="number"
                        onChange={this.handleChange.bind(this, this.isInvalidNumber, 'containerSize')}
                        errorText={this.state.errors.containerSize}
                    >
                    </TextField>
                </Grid>

                <Grid xs={1} md={1/2} lg={1/3}>
                    <TextField
                        floatingLabelText="Daily Watering Frequency"
                        hintText="Times per day"
                        type="number"
                        value={this.state.interval}
                        onChange={this.handleChange.bind(this, this.isInvalidNumber, 'interval')}
                        errorText={this.state.errors.interval}
                    />
                </Grid>

                <Grid xs={1} md={1/2} lg={1/3}>
                    <TextField
                        floatingLabelText="Watering Amount (oz)"
                        value={this.state.waterAmount}
                        type="number"
                        onChange={this.handleChange.bind(this, this.isInvalidNumber, 'waterAmount')}
                        errorText={this.state.errors.waterAmount}
                    >
                    </TextField>
                </Grid>

                <Grid xs={1} md={1/2} lg={1/3}>
                    <TimePicker
                        floatingLabelText="Watering Time"
                        value={this.state.startTime}
                        onChange={this.handleChange.bind(this, this.isInvalidString, 'startTime')}
                        errorText={this.state.errors.startTime}
                    />
                </Grid>

                <Grid xs={1} md={1/2} lg={1/3}>
                    <TextField
                        floatingLabelText="Minimum Temperature"
                        type="number"
                        value={this.state.minTemp}
                        onChange={this.handleChange.bind(this, this.isInvalidNumber, 'minTemp')}
                        errorText={this.state.errors.minTemp}
                    />
                </Grid>

                <Grid xs={1} md={1/2} lg={1/3}>
                    <TextField
                        floatingLabelText="Minimum Moisture Percent"
                        type="number"
                        value={this.state.minMoisture}
                        onChange={this.handleChange.bind(this, this.isInvalidPercent, 'minMoisture')}
                        errorText={this.state.errors.minMoisture}
                    />
                </Grid>

                <Grid xs={1} md={1/2} lg={1/3}>
                    <TextField
                        floatingLabelText="Maximum Moisture Percent"
                        type="number"
                        value={this.state.maxMoisture}
                        onChange={this.handleChange.bind(this, this.isInvalidPercent, 'maxMoisture')}
                        errorText={this.state.errors.maxMoisture}
                    />
                </Grid>

                <Grid xs={1} md={1} lg={1} style={containerStyle}>
                    <h3>{"Days to Water"}</h3>
                </Grid>

                <Grid xs={1} md={1} lg={1} >
                    <DayBoxes onStateChange={this.handleChange.bind(this, null, 'days')} days={this.state.days}/>
                </Grid>

                <Grid xs={1} style={buttonContainerStyle}>
                    { this.props.scheduleId ?
                            <RaisedButton label="Delete"
                                          style={ buttonStyle }
                                          secondary={true}
                                          onClick={() => {
                                              this.props.onDeleteSchedule(this.props.scheduleId)
                                              this.context.router.history.push(this.props.onSave)
                                          }}
                            />
                        :
                        null
                    }
                        <RaisedButton label="Save"
                                      style={ buttonStyle }
                                      onClick={() => {
                                          let newState = _.extend({}, this.state);
                                          newState.startTime = moment(newState.startTime).utc().format('HHmm');
                                          this.props.onSaveSchedule(newState, this.props.scheduleId)
                                          this.context.router.history.push(this.props.onSave)
                                      }}
                                      disabled={_.filter(this.state.errors, function(o) { return !!o }).length > 0}
                        />

                    <Link to={this.props.onCancel}>
                        <RaisedButton label="Cancel"
                                      style={ buttonStyle }
                        />
                    </Link>
                </Grid>
            </div>
        )
    }
}

EditSchedule.contextTypes = {
    router: React.PropTypes.object
};

export default EditSchedule;