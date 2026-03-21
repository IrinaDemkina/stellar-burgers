import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectCurrentOrderError,
  selectCurrentOrderLoading
} from '../../services/slices/feedSlice';
import { useParams } from 'react-router-dom';
import { NotFound404 } from '@pages';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const orderData = useSelector(selectCurrentOrder);
  const orderNumber = Number(number);
  const orderLoading = useSelector(selectCurrentOrderLoading);
  const orderError = useSelector(selectCurrentOrderError);

  useEffect(() => {
    if (Number.isFinite(orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, id) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (!ingredient) return acc;
        if (!acc[id]) acc[id] = { ...ingredient, count: 1 };
        else acc[id].count++;

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!Number.isFinite(orderNumber)) return <NotFound404 />;
  if (orderLoading || !ingredients.length) return <Preloader />;
  if (orderError || !orderData || !orderInfo) return <NotFound404 />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
