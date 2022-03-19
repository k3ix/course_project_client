import i18n from "../i18n";

export const ADMIN_COLUMNS = [
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
];

export const OVERVIEWS_COLUMNS = [
    {
        field: 'id',
        renderHeader: () => i18n.t("user.headers.id"),
        sortable: false,
        width: 70
    },
    {
        field: "title",
        renderHeader: () => i18n.t("user.headers.title"),
        sortable: true,
        width: 220
    },
    {
        field: "group",
        renderHeader: () => i18n.t("user.headers.group"),
        sortable: true,
        width: 100,
        valueFormatter: (props) => {
            return i18n.t(`user.groups.${props.value}`);
        }
    },
    {
        field: "createdAt",
        renderHeader: () => i18n.t("user.headers.created"),
        sortable: true,
        width: 190,
        valueFormatter: (props) => {
            return `${new Date(props.value).toLocaleString()}`
        }
    },
    {
        field: "updatedAt",
        renderHeader: () => i18n.t("user.headers.updated"),
        sortable: true,
        width: 190,
        valueFormatter: (props) => {
            return `${new Date(props.value).toLocaleString()}`
        }
    }
]