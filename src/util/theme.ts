import { createTheme, makeStyles } from "@rneui/themed";

type Props = {
  fullWidth?: boolean;
};

export const useStyles = makeStyles((theme, props: Props) => ({
  container: {
    backgroundColor: "#fff",
    width: props.fullWidth ? "100%" : "auto",
  },
  text: {
    color: theme.colors.primary,
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
}));
