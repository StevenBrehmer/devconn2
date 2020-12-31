//racfp shorthand for skeleton
import React from 'react';
import PropTypes from 'prop-types';
// anytime you want to interact a component from redux, eithe rcalling action or getting state
// you want to use connect
import {connect} from 'react-redux';

const Alert = ({alerts}) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
    //when mapping through an array like this in jsx - you need a unique key
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
    </div>
));

Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
