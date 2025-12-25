import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import SvgIcons from '../../components/SvgIcons';
import { color } from '../color/color';
import Typography from '../components/Typography';

const OtpErrorPopup = ({ 
    visible, 
    onClose, 
    title = "Sending Failed", 
    subtitle = "We couldn't send the OTP. Please try shortly.",
    showResendButton = false,
    onResend 
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.conatiner}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <SvgIcons.CrossIconBrownbg width={24} height={24} />
                    </TouchableOpacity>

                    <View style={styles.iconContainer}>
                        <View style={styles.errorIconCircle}>
                            <SvgIcons.errorRedCircleIcon width={48} height={48} fill={color.white_FFFFFF} />
                        </View>
                    </View>
                    
                    <Typography style={styles.title}
                        weight="500"
                        size={18}
                        color={color.brown_766F6A}>
                        {title}
                    </Typography>

                    <Typography style={styles.subtitle}
                        weight="400"
                        size={14}
                        color={color.brown_766F6A}>
                        {subtitle}
                    </Typography>

                    {showResendButton && onResend && (
                        <TouchableOpacity style={styles.resendButton} onPress={onResend}>
                            <Typography
                                weight="600"
                                size={16}
                                color={color.btnBrown_AE6F28}
                            >
                                Resend
                            </Typography>
                        </TouchableOpacity>
                    )}
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
    conatiner: {
        width: '100%',
        paddingHorizontal: 30,
        marginBottom: 150,
    },
    modalContainer: {
        backgroundColor: color.white_FFFFFF,
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        zIndex: 1,
        padding: 5,
    },
    iconContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    errorIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: color.red_FF3B30,
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
    resendButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: 'center',
        width: '100%',
        alignItems: 'center',
    },
});

export default OtpErrorPopup; 