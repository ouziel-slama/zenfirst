import { notification } from "antd";

const showNotification = (type: string, details: any) => {
    if(type == 'success' || type == 'error') {
        notification[type]({
            message: details.message,
            description: details.description,
        });
    }
};
export default showNotification;