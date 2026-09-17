import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: number;
};

export const OrderDetails = ({ orderNumber }: TOrderDetailsProps): React.JSX.Element => (
  <div className={styles.content}>
    <p className={`${styles.number} text text_type_digits-large`}>{orderNumber}</p>
    <p className="text text_type_main-medium mt-8">идентификатор заказа</p>
    <div className={styles.check} aria-hidden="true">
      <CheckMarkIcon type="primary" />
    </div>
    <p className="text text_type_main-default mt-15">Ваш заказ начали готовить</p>
    <p className="text text_type_main-default text_color_inactive mt-2">
      Дождитесь готовности на орбитальной станции
    </p>
  </div>
);
