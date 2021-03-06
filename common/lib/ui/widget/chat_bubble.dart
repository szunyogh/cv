import 'package:common/ui/widget/like_indicator.dart';
import 'package:common/ui/widget/saw_indicator.dart';
import 'package:common/ui/widget/send_indicator.dart';
import 'package:flutter/material.dart';

class ChatBubble extends StatelessWidget {
  final double maxWidth;
  final bool isSender;
  final String message;
  final bool isShowIndicator;
  final Function() doubleTap;
  final bool isSaw;
  final String like;
  final Function onTap;
  const ChatBubble({
    Key? key,
    required this.maxWidth,
    required this.isSender,
    this.message = "",
    this.isShowIndicator = false,
    required this.doubleTap,
    this.isSaw = false,
    this.like = "",
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: isSender ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: [
        Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              constraints: BoxConstraints(maxWidth: maxWidth),
              margin: const EdgeInsets.fromLTRB(0, 0, 7, 10),
              padding: const EdgeInsets.fromLTRB(15, 5, 15, 5),
              decoration: BoxDecoration(
                color: isSender ? Colors.blue : Colors.grey[300],
                borderRadius: BorderRadius.circular(20),
              ),
              child: InkWell(
                onDoubleTap: () => doubleTap(),
                child: Text(
                  message,
                  style: isSender ? Theme.of(context).textTheme.bodyText1 : Theme.of(context).textTheme.bodyText2,
                ),
              ),
            ),
            if (isSender)
              Positioned(
                right: 0,
                bottom: 2,
                child: SawIndicator(showIndicator: isSaw),
              ),
            if (like.isNotEmpty)
              Positioned(
                bottom: 2,
                left: isSender ? -12 : null,
                right: isSender ? null : -3,
                child: LikeIndicator(
                  like: like,
                  onTap: () => onTap(),
                ),
              ),
          ],
        ),
        if (isSender)
          SendIndicator(
            showIndicator: isShowIndicator,
          ),
      ],
    );
  }
}
