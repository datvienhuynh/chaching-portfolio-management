from django.core.mail import send_mail


def sendEmail(subject, content, email):
    if isinstance(email, list):
        send_mail(subject, content, "finnbutton@gmail.com", email, fail_silently=False)
    else:
        send_mail(
            subject, content, "finnbutton@gmail.com", [email], fail_silently=False
        )
