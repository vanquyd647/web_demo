import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import Announcement from "../../components/Announcement/Announcement";
import { useAnnouncement } from "../../contexts/Announcement";

const ForgotPassword = () => {
  const { setError, setMessage, setSuccess } = useAnnouncement();
  const [isOTPSent, setIsOTPSent] = useState(false);

  const handleSendOTP = async (values, { setSubmitting, setErrors }) => {
    try {
      // Giả lập API gửi OTP
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setMessage("OTP đã được gửi đến email của bạn.");
        setIsOTPSent(true);
      } else {
        setError(true);
        setMessage(result.message || "Không thể gửi OTP. Vui lòng thử lại.");
        setErrors({ submit: "Không thể gửi OTP. Vui lòng thử lại." });
      }
    } catch (error) {
      setError(true);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setErrors({ submit: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Announcement />

      <Formik
        initialValues={{
          email: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Địa chỉ email không hợp lệ")
            .required("Email là bắt buộc"),
        })}
        onSubmit={handleSendOTP}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-forgot-password">
                    Email của bạn
                  </InputLabel>
                  <OutlinedInput
                    id="email-forgot-password"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error>{errors.email}</FormHelperText>
                  )}
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    disableElevation
                    fullWidth
                    type="submit"
                    size="large"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || isOTPSent}
                  >
                    {isOTPSent ? "OTP đã được gửi" : "Gửi OTP"}
                  </Button>
                </Box>
              </Grid>

              {isOTPSent && (
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{ textAlign: "center", color: "green", mt: 2 }}
                  >
                    Vui lòng kiểm tra email của bạn để nhận mã OTP.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPassword;
