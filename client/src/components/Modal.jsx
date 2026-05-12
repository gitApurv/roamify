import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 29,
                }}
                onClick={onClose}
            />

            {/* Modal Content */}
            <Box
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 30,
                    bgcolor: "background.paper",
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                    width: { xs: "90vw", sm: "auto" },
                    maxWidth: 450,
                    minWidth: { sm: 350 },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    animation: "slideIn 0.3s ease-out",
                    "@keyframes slideIn": {
                        from: {
                            opacity: 0,
                            transform: "translate(-50%, -48%)",
                        },
                        to: {
                            opacity: 1,
                            transform: "translate(-50%, -50%)",
                        },
                    },
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: "text.secondary",
                        "&:hover": {
                            backgroundColor: "action.hover",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Content */}
                {children}
            </Box>
        </>
    );
};

export default Modal;
