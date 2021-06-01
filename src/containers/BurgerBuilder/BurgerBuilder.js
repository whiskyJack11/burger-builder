import React, { Component } from "react";
import { connect } from 'react-redux';

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component {
    state = {        
        purchasing: false
    }

    componentDidMount() {
        console.log(this.props);
        this.props.onInitIngredients();
        
    }

    updatePurchaseState (ingredients) {
        //const ingredients = { ...this.state.ingredients };
        const sum = Object
                    .keys(ingredients)
                    .map(igKey => { return ingredients[igKey]; })
                    .reduce((sum, el) => { return sum + el; }, 0);
        return sum > 0;
        //this.setState({ purchasable: sum > 0 });
    }

    purchaseHandler = () =>  {
         this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {        
        /* const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        //console.log(queryParams);
        queryParams.push('price=' + this.state.totalPrice);
        //console.log(queryParams);
        
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        }); */
        this.props.history.push('/checkout');
    }
    
    render() {

        const disabledInfo = { ...this.props.ings };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0; //{ salad: true, meat:false....}
        }

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded...</p> : <Spinner />;
        console.log(this.props.ings);
        if(this.props.ings) {            
            burger =  (
                <Aux>
                    <Burger ingredients={ this.props.ings } />
                        <BuildControls 
                            ingredientAdded={ this.props.onIngredientAdded }
                            ingredientRemoved={ this.props.onIngredientRemoved }
                            disabled={ disabledInfo }
                            price={ this.props.price }
                            purchasable={ this.updatePurchaseState(this.props.ings) }
                            ordered={ this.purchaseHandler } />
                </Aux>
            );
            
            orderSummary = <OrderSummary 
                ingredients={ this.props.ings }
                purchaseCancelled={ this.purchaseCancelHandler }
                purchaseContinued={ this.purchaseContinueHandler }
                price={ this.props.price } />;
        }
        /* if(this.state.loading) {
            orderSummary = <Spinner />;
        } */

        return (
            <Aux>
                <Modal show={ this.state.purchasing } modalClosed={ this.purchaseCancelHandler }>
                    { orderSummary }
                </Modal>
                { burger }               
            </Aux>

        );
    }

}
const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));