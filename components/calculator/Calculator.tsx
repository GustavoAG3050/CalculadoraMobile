import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { formatNumber, parseExpression } from "./utils";

interface ButtonConfig {
  label: string;
  onPress: () => void;
  isOperator?: boolean;
  isEquals?: boolean;
  isDelete?: boolean;
  colSpan?: number;
}

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [expression, setExpression] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupResult, setPopupResult] = useState<string>("");
  const [lastCharIsOperator, setLastCharIsOperator] = useState<boolean>(true);

  
  const handleNumberPress = (num: string) => {
    let newDisplay = display;

    if (display === "0" && num !== ".") {
      newDisplay = num;
    } else if (lastCharIsOperator) {
      newDisplay = num;
    } else {
      if (newDisplay.replace(".", "").length < 12) {
        newDisplay += num;
      }
    }

    setDisplay(newDisplay);
    setLastCharIsOperator(false);
  };

  const handleDecimal = () => {
    let newDisplay = display;

    if (display.includes(" ")) {
      newDisplay = "0.";
    } else if (!display.includes(".")) {
      newDisplay = display + ".";
    }

    setDisplay(newDisplay);
    setLastCharIsOperator(false);
  };

  const handleOperator = (op: string) => {
    if (display === "0" && expression === "") {
      return;
    }

    let newExpression = expression;

    if (lastCharIsOperator) {
      newExpression = newExpression.trim().slice(0, -1);
    } else {
      newExpression = newExpression + " " + display + " ";
    }

    const parts = newExpression.trim().split(/\s+/);
    if (parts.length >= 3) {
      try {
        const tempExpr = parts.slice(0, -1).join(" ");
        const intermediate = parseExpression(tempExpr);
        newExpression = formatNumber(intermediate) + " ";
      } catch (e) {
        
      }
    }

    newExpression = newExpression + op;

    setExpression(newExpression);
    setDisplay(op);
    setLastCharIsOperator(true);
  };

  const handleDelete = () => {
    if (display === "0" && expression === "") {
      return;
    }

    if (display.length === 1) {
      setDisplay("0");
      setLastCharIsOperator(false);
    } else {
      setDisplay(display.slice(0, -1));
      setLastCharIsOperator(false);
    }
  };

  const handleEquals = () => {
    if (expression === "" || lastCharIsOperator) {
      return;
    }

    try {
      const fullExpression = expression + " " + display;
      const result = parseExpression(fullExpression);
      const formattedResult = formatNumber(result);

      setPopupResult(formattedResult);
      setShowPopup(true);

      setTimeout(() => {
        setDisplay("0");
        setExpression("");
        setLastCharIsOperator(true);
      }, 100);
    } catch (error) {
      setPopupResult("Erro: Divisão por zero");
      setShowPopup(true);

      setTimeout(() => {
        setDisplay("0");
        setExpression("");
        setLastCharIsOperator(true);
      }, 100);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setDisplay("0");
    setExpression("");
    setLastCharIsOperator(true);
  };

  const buttonLayout: ButtonConfig[][] = [
    [
      { label: "7", onPress: () => handleNumberPress("7") },
      { label: "8", onPress: () => handleNumberPress("8") },
      { label: "9", onPress: () => handleNumberPress("9") },
      { label: "÷", onPress: () => handleOperator("÷"), isOperator: true },
    ],
    [
      { label: "4", onPress: () => handleNumberPress("4") },
      { label: "5", onPress: () => handleNumberPress("5") },
      { label: "6", onPress: () => handleNumberPress("6") },
      { label: "×", onPress: () => handleOperator("×"), isOperator: true },
    ],
    [
      { label: "1", onPress: () => handleNumberPress("1") },
      { label: "2", onPress: () => handleNumberPress("2") },
      { label: "3", onPress: () => handleNumberPress("3") },
      { label: "−", onPress: () => handleOperator("-"), isOperator: true },
    ],
    [
      { label: "0", onPress: () => handleNumberPress("0") },
      { label: ".", onPress: handleDecimal },
      { label: "=", onPress: handleEquals, isEquals: true },
      { label: "+", onPress: () => handleOperator("+"), isOperator: true },
    ],
    [
      {
        label: "⌫",
        onPress: handleDelete,
        isDelete: true,
        colSpan: 4,
      },
    ],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.calculatorBox}>
        
        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>{display}</Text>
        </View>

        
        <View style={styles.buttonGrid}>
          {buttonLayout.map((row, rowIdx) => (
            <View key={`row-${rowIdx}`} style={styles.buttonRow}>
              {row.map((button, btnIdx) => (
                <TouchableOpacity
                  key={`btn-${rowIdx}-${btnIdx}`}
                  style={[
                    styles.button,
                    button.isOperator && styles.operatorButton,
                    button.isEquals && styles.equalsButton,
                    button.isDelete && styles.deleteButton,
                    button.colSpan ? { flex: button.colSpan } : undefined,
                  ]}
                  onPress={button.onPress}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      (button.isOperator || button.isEquals) && styles.operatorText,
                      button.isDelete && styles.deleteText,
                    ]}
                  >
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePopup}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Resultado</Text>

            <TextInput
              style={styles.popupInput}
              value={popupResult}
              editable={false}
              selectTextOnFocus={true}
            />

            <TouchableOpacity
              style={styles.popupCloseButton}
              onPress={handleClosePopup}
            >
              <Text style={styles.popupCloseText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  calculatorBox: {
    width: 320,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
  },

  
  displayContainer: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 60,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  displayText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "monospace",
  },

  
  buttonGrid: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 4,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 4,
  },

  button: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },

  buttonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },

  operatorButton: {
    backgroundColor: "#ff9500",
  },

  operatorText: {
    color: "#fff",
    fontWeight: "600",
  },

  equalsButton: {
    backgroundColor: "#4CAF50",
  },

  deleteButton: {
    backgroundColor: "#f44336",
  },

  deleteText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },

  
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: 280,
    elevation: 5,
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },

  popupInput: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    fontSize: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
    fontFamily: "monospace",
    minHeight: 44,
  },

  popupCloseButton: {
    backgroundColor: "#ff9500",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },

  popupCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
