import { createTheme } from "@mui/material/styles";

const grayscaleTheme = createTheme({
  palette: {
    primary: {
      main: "#808080", // よりニュートラルなグレー
      light: "#a6a6a6", // 黒みのある薄いグレー
      dark: "#5a5a5a", // 黒みのあるダークグレー
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a0a0a0", // よりニュートラルなセカンダリカラー
      light: "#d1d1d1", // 黒みのある薄いセカンダリ
      dark: "#777777", // 黒みのあるダークセカンダリ
      contrastText: "#ffffff",
    },
    background: {
      default: "#f7f7f7", // 純粋な白に近いグレー背景
      paper: "#ffffff",
    },
    text: {
      primary: "#333333", // 黒みの強いテキストカラー
      secondary: "#888888", // 黒みのあるセカンダリテキスト
      disabled: "#cccccc", // ニュートラルな無効テキスト
    },
    divider: "#e6e6e6", // ニュートラルな区切り線
    error: {
      main: "#999999", // ニュートラルなエラーカラー
    },
    warning: {
      main: "#b3b3b3", // ニュートラルなワーニングカラー
    },
    info: {
      main: "#c2c2c2", // ニュートラルなインフォカラー
    },
    success: {
      main: "#a9a9a9", // ニュートラルなサクセスカラー
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: "#333333", // 黒みの強いヘディングカラー
    },
    h2: {
      color: "#333333",
    },
    h3: {
      color: "#333333",
    },
    h4: {
      color: "#333333",
    },
    h5: {
      color: "#333333",
    },
    h6: {
      color: "#333333",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#808080", // ニュートラルなグレーのアプリバー
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)", // よりニュートラルな影
        },
      },
    },
  },
});

export default grayscaleTheme;
