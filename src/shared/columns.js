import i18n from "../i18n";

export const COLUMNS = [
    {
        field: 'id',
        renderHeader: () => i18n.t("adminPanel.id"),
        sortable: false,
        width: 50
    },
    {
        field: 'username',
        renderHeader:  () => i18n.t("adminPanel.username"),
        sortable: false,
        width: 150,
    },
    {
        field: 'email',
        renderHeader: () => i18n.t("adminPanel.email"),
        sortable: false,
        width: 230,
    },
    {
        field: 'isBlocked',
        renderHeader: () => i18n.t("adminPanel.blockStatus"),
        sortable: false,
        width: 150,
        valueFormatter: (props) => {
            if (props.value) {
                return i18n.t("adminPanel.yes")
            } else {
                return i18n.t("adminPanel.no")
            }
        }
    },
    {
        field: 'isAdmin',
        renderHeader: () => i18n.t("adminPanel.admin"),
        sortable: false,
        width: 80,
        valueFormatter: (props) => {
            if (props.value) {
                return i18n.t("adminPanel.yes")
            } else {
                return i18n.t("adminPanel.no")
            }
        }
    },
    {
        field: 'createdAt',
        renderHeader: () => i18n.t("adminPanel.regDate"),
        sortable: false,
        width: 160,
        valueFormatter: (props) => {
            return `${new Date(props.value).toLocaleString()}`
        }
    }
]