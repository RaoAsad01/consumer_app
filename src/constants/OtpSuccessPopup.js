import React, { useEffect, useRef } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from '../components/Typography';

const OtpSuccessPopup = ({ visible, onClose, title = "OTP Sent Successfully", subtitle = "We've sent a one-time password to your email" }) => {
    const timerRef = useRef(null);
    
    // Auto-close after 2 seconds
    useEffect(() => {
        if (visible) {
            // Clear any existing timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            
            // Set new timer
            timerRef.current = setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            // Clear timer when modal is not visible
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }

        // Cleanup function
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [visible, onClose]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <View style={styles.successIconCircle}>
                            <SvgIcons.successBrownSVG width={38} height={38} fill={color.white_FFFFFF} />
                        </View>
                    </View>
                    
                    <Typography style={styles.title}
                        weight="700"
                        size={15}
                        color={color.brown_766F6A}>
                        {title}
                    </Typography>

                    <Typography style={styles.subtitle}
                        weight="400"
                        size={13}
                        color={color.brown_766F6A}>
                        {subtitle}
                    </Typography>
                </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        paddingHorizontal: 30,
        marginBottom: 200
    },
    modalContainer: {
        backgroundColor: color.white_FFFFFF,
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
       
    },
    iconContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    successIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: color.btnBrown_AE6F28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    subtitle: {
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default OtpSuccessPopup; 